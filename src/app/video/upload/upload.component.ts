import { Component , OnDestroy } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { v4 as uuid } from 'uuid';
import { last , switchMap, combineLatest , forkJoin} from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import  firebase  from 'firebase/compat/app';
import { ClipService } from 'src/app/services/clip.service';
import { Router } from '@angular/router';
import { FfmpegService } from 'src/app/services/ffmpeg.service';


@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnDestroy {

  isDragover = false
  file: File | null = null;
  nextStep = false
  notAvalidFile = false
  alertColor = 'blue'
  alertMsg = 'Please Wait! Your clip is being uploaded.'
  showAlert = false;
  inSubmission = false;
  percentage = 0;
  showPercentage = false
  user : firebase.User | null = null;
  extension = '';
  task?: AngularFireUploadTask ; 
  ffmpegServiceReady = false
  screenshots: string[] = []
  selectedScreenshot = ''
  screenshotTask?: AngularFireUploadTask

  title = new FormControl('', {
    validators: [
      Validators.required,
      Validators.minLength(3)
    ], nonNullable: true
  })



  uploadForm = new FormGroup({
    title: this.title,

  });

  constructor(
      private storage :  AngularFireStorage,
      private auth : AngularFireAuth ,
      private clipsService : ClipService,
      private router : Router,
      public ffmpegService : FfmpegService
    ){
      auth.user.subscribe(user => this.user = user);
      this.ffmpegService.init()
  }

 async storeFile($event: Event) {


    if(this.ffmpegService.isRunning){
      return 
    }
    this.isDragover = false;
    console.log($event);
    this.file =
    ($event as DragEvent).dataTransfer ? 
    (($event as DragEvent).dataTransfer?.files.item(0) ?? null) : 
    (($event.target as HTMLInputElement).files?.item(0) ?? null)
    
    ; // (gotya with chrome)


    console.log(this.file);
    if (!this.file || !this.file.type.startsWith('video')) {
      this.showAlert = true;
      console.log(this.showAlert)
      return
    }

    this.screenshots = await this.ffmpegService.getScreenshots(this.file)
    this.selectedScreenshot = (this.screenshots[0] ?? '' )
    this.nextStep = true;

    this.title.setValue(this.file.name.split('.').slice(0, 1).join(''))
    this.extension = this.file.name.split('.').slice(1).join('');
    console.log(this.file);
  }

   selectScreenShot( ssURL:string){
    this.selectedScreenshot = ssURL;
   }

  async uploadFile(){

    this.uploadForm.disable();
    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMsg = 'Please Wait! Your Clip is being uploaded.'
    this.inSubmission = true;
    this.showPercentage = true;


    const clipFileName = uuid();
    const clipPath = `clips/${clipFileName}`;

    const screenshotBlob =  await this.ffmpegService.blobFromURL(
      this.selectedScreenshot
    )
    const screenShotPath = `screenshots/${clipFileName}`;


    this.task = this.storage.upload(clipPath,this.file);
    const clipRef = this.storage.ref(clipPath);

    this.screenshotTask = this.storage.upload(screenShotPath,screenshotBlob)

    const screenshotRef = this.storage.ref(screenShotPath)
   combineLatest( [this.task .percentageChanges(),
    this.screenshotTask.percentageChanges()
  
  ]).subscribe( values => {

    const [clipProgress , screenshotProgress] = values;

    if(!clipProgress || !screenshotProgress){
      return 
    }

    const total = clipProgress + screenshotProgress

    this.percentage = (total as number) / 200;
    });

    
   forkJoin([
    this.task.snapshotChanges(),
    this.screenshotTask.snapshotChanges()

   ]).pipe(
    
      switchMap(()=> forkJoin([ 
        clipRef.getDownloadURL() ,
        screenshotRef.getDownloadURL()
      
      ]))
    ).subscribe({
      next : async (urls) => {
        const [clipURL, screenshotURL] = urls;
        console.log(firebase.firestore.FieldValue.serverTimestamp());
        const clip = {
          uid : (this.user?.uid as string),
          displayName : (this.user?.displayName  as string),
          title : this.title.value,
          fileName : `${clipFileName}`,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          url: clipURL,
          screenshotURL,
          screenshotFileName: `${clipFileName}`
        };

        const clipDocRef = await this.clipsService.createClip(clip);

        this.alertColor = 'green'
        this.alertMsg = 'Success! Your Clip is now ready to share with the world'
        this.showPercentage = false

        setTimeout(()=>{
          this.router.navigate([
            'clip',clipDocRef.id
          ])
        },1000)

      },
      error : (err) =>{
        this.uploadForm.enable()
        this.alertColor = 'red'
        this.alertMsg = 'Upload Failed! Please try again later'
        this.inSubmission = true
        this.showPercentage = false
        console.error(err)
      }    
    });

  }

 

  ngOnDestroy(): void {
    this.task?.cancel();
  }

}
