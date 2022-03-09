import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";

@Injectable()
export class UploadService {
    maxSimultaneousSource = new BehaviorSubject(+Infinity);
    fileReadySource = new BehaviorSubject(false);
    queuedFileSource = new Subject();
    url: any;

    maxSimultaneousCount$ = this.maxSimultaneousSource.asObservable();
    queuedFile$ = this.queuedFileSource.asObservable();
    fileUploadReady$ = this.fileReadySource.asObservable();

    queueFile(file: any) {
        this.queuedFileSource.next(file);
    }

    readyFile(state: boolean) {
        this.fileReadySource.next(state);
    }

    setMaxSimultaneous(count: number) {
        this.maxSimultaneousSource.next(count);
    }
}