import { Component, Inject, Input, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { UploadService } from "./uploadService.class";
import { Subscription } from "rxjs";
import { animate, style, transition, trigger } from "@angular/animations";

@Component({
    selector: 'upload',
    templateUrl: 'upload_component.template.html',
    animations: [
        trigger('showHideProgress', [
            transition(':leave', [
                animate('200ms', style({ opacity: 0, transform: 'translateY(0px)' }))
            ])
        ])
    ]
})
export class UploadComponent implements OnInit, OnDestroy {
    @Input('url') url: any;
    @Input('maxUploadFiles') maxUploadFiles: any;

    selectedFiles = new Map<any, any>();
    filesIterator = this.selectedFiles.values();
    uploading: boolean = false;
    uploadingFinished: boolean = true;
    uploadingDone: boolean = false;
    uploadCanceled: boolean = false;
    uploadedFilesCount: number = 0;
    concurrentFilesSubscription!: Subscription;
    readyFilesSubscription!: Subscription;

    uploadForm!: FormGroup;
    files = new FormControl('');

    constructor(private uploadService: UploadService) {
        this.concurrentFilesSubscription = this.uploadService.concurrentFilesCount$.subscribe((count: any) => {
            this.prepareFileAndStartUpload(count);
        });
        this.readyFilesSubscription = this.uploadService.readyUploads$.subscribe((count: any) => {
            this.updateUploadStatus(count);
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
        this.readyFilesSubscription.unsubscribe();
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
        this.uploadingDone = false;
        this.uploadedFilesCount = 0;
        this.uploadService.uploadedFilesCount = 0;
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

    prepareFileAndStartUpload(concurrentCount: number) {
        if (concurrentCount < this.maxUploadFiles) {
            let fileUploaded = this.filesIterator.next();
            if (!fileUploaded.done) {
                this.uploadService.uploadFile(fileUploaded);
            }
        }
    }

    updateUploadStatus(rdyUploads: number) {
        this.uploadedFilesCount = rdyUploads;
        if (this.uploadedFilesCount == this.selectedFiles.size) {
            this.uploadingFinished = true;
            this.uploadingDone = true;
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