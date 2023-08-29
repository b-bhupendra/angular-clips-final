import { Injectable } from '@angular/core';
import { 
        AngularFirestore,
        AngularFirestoreCollection,
        DocumentReference,
        DocumentData,
        QuerySnapshot
      } from '@angular/fire/compat/firestore';

import IClip from '../models/clip.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { switchMap , of, map,BehaviorSubject,combineLatest, Observable } from 'rxjs';
import { AngularFireStorage  } from '@angular/fire/compat/storage';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
 
@Injectable({
  providedIn: 'root'
})
export class ClipService  implements Resolve<IClip | null> {
  public clipsCollections : AngularFirestoreCollection;
  pageClips : IClip[] = []
  pendingReq = false
  constructor(
    private db: AngularFirestore,
    private auth: AngularFireAuth,
    private storage : AngularFireStorage,
    private router: Router
  ) {
      this.clipsCollections = db.collection('clips')
       
   }

     createClip(data : IClip) :Promise<DocumentReference<DocumentData>> {
  
      
      return   this.clipsCollections.add(data)
   }

   getUserClips(sort$ : BehaviorSubject<string>){
    return combineLatest([this.auth.user,sort$]).pipe(
      switchMap(values => {

        const [user , sort ] = values;

        if(!user){
          return of([])
        }

        const query = this.clipsCollections.ref.where(
          'uid' , '==', user.uid
        ).orderBy('timestamp', sort ==='1' ? 'desc' : 'asc')

        return query.get()

      }),
      map((snapshot) => (snapshot as  QuerySnapshot<IClip>).docs)

    )
   }

   updateClip(id:string , title: string){
    return this.clipsCollections.doc(id).update({
      title 
    })
   }

   async deleteClip(clip :IClip){
     
    const clipRef = this.storage.ref(`clips/${clip.fileName}`)
    const screenshotRef = this.storage.ref(`screenshots/${clip.screenshotFileName}`)
    await clipRef.delete()
    await screenshotRef.delete()
    await this.clipsCollections.doc(clip.docID).delete()
   }

   async getClips(){
      if(this.pendingReq){
        return
      }

      this.pendingReq = true
      let query = this.clipsCollections.ref.orderBy(
        'timestamp','desc'
      ).limit(6);

        const {length} = this.pageClips

        if(length){
          
          const lastDocID = this.pageClips[length-1].docID;
          const lastDoc = await this.clipsCollections.doc(lastDocID)
                          .get()
                          .toPromise();
          query = query.startAfter(lastDoc)


        }
        console.log('heelo');
        const snapshot = await query.get()
        
        snapshot.forEach(doc => {
          console.log(doc.data().timestamp.seconds)
          const data = (doc.data() as IClip);
          this.pageClips.push({
            docID : doc.id,
            ...data
          })
        })
        this.pendingReq = false
   }  

   resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): IClip | Observable<IClip | null> | Promise<IClip | null> | null {
      return this.clipsCollections.doc(route.params.id)
                                  .get()
                                  .pipe(
                                    
               map(sanpshot => {
                        const data = (sanpshot.data() as IClip)

                    if(!data){
                      this.router.navigate([
                        '/'
                      ])
                      return null
                  }
        return data
      }))
   }

}
