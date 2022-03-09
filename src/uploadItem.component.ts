import { Component, Input, Output, EventEmitter, Inject, OnDestroy } from "@angular/core";
import { HttpClient, HttpEventType, HttpParams, HttpRequest, HttpResponse } from '@angular/common/http';
import {
    style,
    animate,
    transition,
    trigger,
} from "@angular/animations";
import { UploadService } from "./uploadService.class";
import { Subscription } from "rxjs";

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
    @Input() uploading!: boolean;
    @Output() fileRemoved: EventEmitter<any> = new EventEmitter<any>();

    shown: boolean = true;
    ready: boolean = false;
    queueSubscription!: Subscription;

    removeFile(file: any) {
        this.shown = false;
        let timeout = setTimeout(() => {
            this.fileRemoved.emit(file);
            clearTimeout(timeout);
        }, 500);
    }

    getFileSize(size: any) { //simplify
        var units = ['B', 'kB', 'MB', 'GB', 'TB'];
        var i = Math.floor(Math.log(size) / Math.log(1024));
        return (size / Math.pow(1024, i)).toFixed(2) + ' ' + units[i];
    }
}