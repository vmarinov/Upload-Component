import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
    selector: 'upload-item',
    templateUrl: 'upload_item.template.html'
})
export class UploadItemComponent {
    @Input() file: any;
    @Output() fileRemoved: EventEmitter<any> = new EventEmitter<any>();

    removed: boolean = false;

    removeFile(file: any) {
        this.removed = true;
        this.fileRemoved.emit(file);
    }
}