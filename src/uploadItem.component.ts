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
export class UploadItemComponent implements OnDestroy {
    @Input() file: any;
    @Input() uploading!: boolean;
    @Output() fileRemoved: EventEmitter<any> = new EventEmitter<any>();

    shown: boolean = true;
    ready: boolean = false;
    queueSubscription!: Subscription;
    url: any;

    constructor(@Inject('UploadService') private uploadService: UploadService, private http: HttpClient) {
        this.url = this.uploadService.url;
        this.queueSubscription = this.uploadService.queuedFile$.subscribe((queuedFile: any) => {
            if (this.file.value == queuedFile && !this.file?.ready) {
                this.uploadFile();
            }
        });
    }

    ngOnDestroy(): void {
        this.queueSubscription.unsubscribe();
    }

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

    uploadFile() {
        let formData = new FormData();
        let params = new HttpParams();
        let options = {
            params: params,
            reportProgress: true,
        };

        formData.append(this.file.value.name, this.file.value);
        let req = new HttpRequest('POST', this.url, formData, options);
        let upload = this.http.request(req);
        let sub = upload.subscribe(
            (event: any) => {
                if (event.type == HttpEventType.UploadProgress) {
                    this.file.value.percentDone = Math.round(100 * event.loaded / event?.total);
                } else if (event instanceof HttpResponse) {
                    console.log('File is completely loaded!');
                }
            },
            (err: any) => {
                console.error("Upload Error:", err);
            }, () => {
                console.log("Upload done");
                this.file.value.ready = true;
                this.uploadService.readyFile(true);
                sub.unsubscribe();
            }
        )
    }
}