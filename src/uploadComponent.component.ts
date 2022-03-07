import { Component, Input, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { HttpClient, HttpEventType, HttpParams, HttpRequest, HttpResponse } from '@angular/common/http';

@Component({
    selector: 'upload',
    templateUrl: 'upload_component.template.html'
})
export class UploadComponent implements OnInit {
    @Input('url') url: any;
    @Input('multiple') set multi(value: string) {
        this.multiple = (value === 'true');
    }

    selectedFiles = new Map<any, any>();
    uploading: boolean = false;
    multiple: boolean = false;

    uploadForm!: FormGroup;
    files = new FormControl('');

    constructor(private http: HttpClient) { }

    ngOnInit(): void {
        this.uploadForm = new FormGroup(
            {
                files: this.files
            }
        );
    }

    selectFiles(event: any) {
        let files = event.target.files;
        for (let file of files) {
            this.selectedFiles.set(file.name, file);
        }
    }

    dropFiles(event: any) {
        event.preventDefault();
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
    }

    async uploadFiles() {
        this.uploading = true;
        let formData = new FormData();
        let params = new HttpParams();
        let options = {
            params: params,
            reportProgress: true,
        };
        let filePromises = [];

        for await (let file of this.selectedFiles.values()) {
            formData.append('upload', file);
            formData.append('fileName', file.name);
            let req = new HttpRequest('POST', this.url, formData, options);
            let upload = this.http.request(req);
            filePromises.push(upload.toPromise());
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
                    file.ready = true;
                }
            )
        }
    }
}