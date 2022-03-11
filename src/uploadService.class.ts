import { HttpClient, HttpEventType, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable()
export class UploadService {
    url: any;
    sub: any;
    concurrentFilesCount: number = 0;
    uploadedFilesCount: number = 0;
    filesSubscriptions: Set<any> = new Set<any>();

    concurrentUploadsSource = new Subject();
    concurrentFilesCount$ = this.concurrentUploadsSource.asObservable();

    constructor(private http: HttpClient) { }

    concurrentUploads(count: number) {
        this.concurrentUploadsSource.next(count);
    }

    uploadFile(file: any) {
        this.concurrentFilesCount++;
        this.concurrentUploads(this.concurrentFilesCount);

        let formData = new FormData();
        formData.append(file.value.name, file.value);
        let upload = this.http.post(this.url, formData, {
            reportProgress: true,
            observe: 'events'
        });
        let sub: any;
        sub = upload.subscribe({
            next: (event: any) => {
                this.filesSubscriptions.add(sub);
                if (event.type == HttpEventType.UploadProgress) {
                    file.value.percentDone = Math.round(100 * event.loaded / event?.total);
                } else if (event instanceof HttpResponse) {
                    console.log('File is completely loaded!');
                }
            },
            error: (err: any) => {
                console.error("Upload Error:", err);
            },
            complete: () => {
                console.log("Upload done");
                file.value.ready = true;
                this.concurrentFilesCount--;
                this.uploadedFilesCount++;
                this.concurrentUploads(this.concurrentFilesCount);
                sub.unsubscribe();
                this.filesSubscriptions.delete(sub);
            }
        });
    }

    stopUpload() {
        for (let sub of this.filesSubscriptions) {
            if (sub)
                sub.unsubscribe();
        }
        this.filesSubscriptions.clear();
    }
}