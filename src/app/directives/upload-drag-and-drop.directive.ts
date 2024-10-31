import {
  Directive,
  EventEmitter,
  HostBinding,
  HostListener,
  Output,
} from '@angular/core';

@Directive({
  selector: '[appUploadDragAndDrop]',
  standalone: true,
})
export class UploadDragAndDropDirective {
  @Output() private onSelectFiles: EventEmitter<File[]> = new EventEmitter();
  @HostBinding('class.upload-area-active') uploadAreaActive: boolean = false;

  constructor() {}

  @HostListener('dragover', ['$event']) public onDragOver(event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.uploadAreaActive = true;
  }

  @HostListener('dragleave', ['$event']) public onDragLeave(event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.uploadAreaActive = false;
  }

  @HostListener('drop', ['$event']) public onDrop(event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.uploadAreaActive = false;

    let files = event.dataTransfer.files;
    console.log(files);

    let validFiles: Array<File> = files;
    this.onSelectFiles.emit(validFiles);
  }
}
