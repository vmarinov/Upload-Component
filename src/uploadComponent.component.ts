import { Component, Inject, Input, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { HttpClient, HttpEventType, HttpParams, HttpRequest, HttpResponse } from '@angular/common/http';
import { UploadService } from "./uploadService.class";
import { Subscription } from "rxjs";

@Component({
    selector: 'upload',
    templateUrl: 'upload_component.template.html'
})
export class UploadComponent implements OnInit, OnDestroy {
    @Input('url') url: any;
    @Input('maxUploadFiles') maxUploadFiles: any;

    selectedFiles = new Map<any, any>();
    filesIterator = this.selectedFiles.values();
    fileUploaded: any;
    uploading: boolean = false;
    uploadingFinished: boolean = true;
    multiple: boolean = false;
    fileStatusSubscription!: Subscription;

    uploadForm!: FormGroup;
    files = new FormControl('');

    constructor(private http: HttpClient, private uploadService: UploadService) {
        if (this.maxUploadFiles) {
            this.uploadService.setMaxSimultaneous(this.maxUploadFiles);
        }

        this.fileStatusSubscription = this.uploadService.fileUploadReady$.subscribe((state: any) => {
            if (state) {
                this.fileUploaded = this.filesIterator.next();
                if (!this.fileUploaded.done) {
                    this.uploadService.queueFile(this.fileUploaded.value);
                } else {
                    this.uploadingFinished = true;
                }
                this.uploadService.readyFile(false);
            }
        });
    }

    ngOnInit(): void {
        this.uploadService.url = this.url;
        this.uploadForm = new FormGroup(
            {
                files: this.files,
            }
        );
    }

    ngOnDestroy(): void {
        this.fileStatusSubscription.unsubscribe();
    }

    selectFiles(event: any) {
        let files = event.target.files;
        for (let file of files) {
            this.selectedFiles.set(file.name, file);
        }
    }

    dropFiles(event: any) {
        event.preventDefault();
        if (this.uploading) {
            return;
        }

        for (let file of event.dataTransfer.files) {
            this.selectedFiles.set(file.name, file);
        }
    }

    dragOver(event: any) {
        event.stopPropagation();
        event.preventDefault();
    }

    removeFile(file: any) {
        if (!this.selectedFiles.has(file)) {
            return;
        }
        this.selectedFiles.delete(file);
    }

    clearSelection() {
        this.selectedFiles.clear();
        this.filesIterator = this.selectedFiles.values();
        this.uploading = false;
    }

    async uploadFiles() {
        this.uploading = true;
        this.uploadingFinished = false;
        if (this.multiple) {
            this.uploadMultiple();
        } else {
            this.uploadOneByOne();
        }
    }

    async uploadOneByOne() {
        let file = this.filesIterator.next();
        if (file) {
            this.uploadService.queueFile(file.value);
        }
    }

    async uploadMultiple() {
        let formData = new FormData();
        let params = new HttpParams();
        let options = {
            params: params,
            reportProgress: true,
        };

        for await (let file of this.selectedFiles.values()) {
            formData.append('upload', file);
            formData.append('fileName', file.name);
            let req = new HttpRequest('POST', this.url, formData, options);
            let upload = this.http.request(req);
            upload.subscribe(
                (event: any) => {
                    if (event.type == HttpEventType.UploadProgress) {
                        file.percentDone = Math.round(100 * event.loaded / event?.total);
                    } else if (event instanceof HttpResponse) {
                        console.log('File is completely loaded!');
                    }
                },
                (err) => {
                    console.error("Upload Error:", err);
                }, () => {
                    console.log("Upload done");
                    file.value.ready = true;
                }
            )
        }
    }

    stopUpload() {
        //unsubscribe post requests
    }

    asIsOrder(a: any, b: any) {
        return 1;
    }
}