import { Component, Input, Output, EventEmitter } from "@angular/core";
import {
    state,
    style,
    animate,
    transition,
    trigger,
} from "@angular/animations";

@Component({
    selector: 'upload-item',
    templateUrl: 'upload_item.template.html',
    animations: [
        trigger('addRemove', [
            transition(':leave', [
                animate('500ms', style({ opacity: 0, transform: 'translateY(0px)' }))
            ])
        ])
    ]
})
export class UploadItemComponent {
    @Input() file: any;
    @Output() fileRemoved: EventEmitter<any> = new EventEmitter<any>();

    shown: boolean = true;

    removeFile(file: any) {
        this.shown = false;
        let timeout = setTimeout(() => {
            this.fileRemoved.emit(file);
            clearTimeout(timeout);
        }, 500);
    }

    getFileSize(size: any) {
        var units = ['B', 'kB', 'MB', 'GB', 'TB'];
        var i = Math.floor(Math.log(size) / Math.log(1024));
        return (size / Math.pow(1024, i)).toFixed(2) + ' ' + units[i];
    }
}