import { Component, Inject, Input, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
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
    uploading: boolean = false;
    uploadingFinished: boolean = true;
    uploadCanceled: boolean = false;
    multiple: boolean = false;
    concurrentFilesSubscription!: Subscription;

    uploadForm!: FormGroup;
    files = new FormControl('');

    constructor(private uploadService: UploadService) {
        this.concurrentFilesSubscription = this.uploadService.concurrentFilesCount$.subscribe((count: any) => {
            if (count < this.maxUploadFiles) {
                let fileUploaded = this.filesIterator.next();
                if (!fileUploaded.done) {
                    this.uploadService.uploadFile(fileUploaded);
                } else {
                    this.uploadingFinished = true;
                }
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
        this.concurrentFilesSubscription.unsubscribe();
    }

    selectFiles(event: any) {
        let alreadySelected = '';
        let files = event.target.files;
        for (let file of files) {
            if (this.selectedFiles.has(file.name)) {
                if (alreadySelected == '') {
                    alreadySelected += `Files already selected: \n ${file.name}\n`
                } else {
                    alreadySelected += `${file.name}\n`;
                }
                continue;
            }
            this.selectedFiles.set(file.name, file);
        }

        event.target.value = '';
        if (alreadySelected != '') {
            alert(alreadySelected);
        }
    }

    dropFiles(event: any) {
        event.preventDefault();
        if (this.uploading) {
            return;
        }

        let alreadySelected = '';
        for (let file of event.dataTransfer.files) {
            if (this.selectedFiles.has(file.name)) {
                if (alreadySelected == '') {
                    alreadySelected += `Files already selected: \n ${file.name}\n`
                } else {
                    alreadySelected += `${file.name}\n`;
                }
                continue;
            }
            this.selectedFiles.set(file.name, file);
        }

        event.target.value = '';
        if (alreadySelected != '') {
            alert(alreadySelected);
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
        this.uploadService.concurrentFilesCount = 0;
        this.uploading = false;
        this.uploadCanceled = false;
        this.files.reset();
    }

    uploadFiles() {
        this.uploading = true;
        this.uploadingFinished = false;
        let file = this.filesIterator.next();
        if (!file?.done) {
            this.uploadService.uploadFile(file);
        }
    }

    stopUpload() { 
        this.uploadService.stopUpload();
        this.uploadCanceled = true;
        this.uploadingFinished = true;
    }

    asIsOrder(a: any, b: any) {
        return 1;
    }
}