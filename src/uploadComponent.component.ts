import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";

@Component({
    selector: 'upload',
    templateUrl: 'upload_component.template.html'
})
export class UploadComponent implements OnInit {
    selectedFiles = new Map<any, any>();

    uploadForm!: FormGroup;
    files = new FormControl('');

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
            let size = `${Number(file.size / 1024).toFixed(2)}kb`;
            this.selectedFiles.set(file.name, { name: file.name, size });
        }
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
}