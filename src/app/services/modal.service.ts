import { Injectable } from '@angular/core';


interface dictionary {
  [key: string]: boolean
}


@Injectable({
  providedIn: 'root'
})

export class ModalService {

  private visible: dictionary = ({} as dictionary)

  constructor() {

  }

  keyExists(key: string): boolean {
    return Object.hasOwn(this.visible, key)

  }

  // register only once else keep the state that it is on
  register(key: string): boolean {

    if (!this.keyExists(key)) {
      this.visible[key] = false
    }

    return true
  }

  unRegister(key: string): boolean {

    if (this.keyExists(key)) {
      delete this.visible[key]
      return true
    }
    return false
  }

  isModalOpen(key: string) {
    return this.keyExists(key) && this.visible[key] == true
  }

  toggleMode(key: string) {
    console.log(this.visible)
    return this.keyExists(key) && (this.visible[key] = !this.visible[key])
  }

}
