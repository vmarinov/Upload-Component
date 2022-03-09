import { BehaviorSubject, Subject } from "rxjs";

export class UploadService {
    maxSimultaneousSource = new BehaviorSubject(+Infinity);
    fileReadySource = new BehaviorSubject(false);
    queuedFileSource = new Subject();

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