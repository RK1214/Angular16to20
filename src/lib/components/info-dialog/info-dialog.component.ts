import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface InfoDialogData {
  title: string;
  message: string;
}

@Component({
  selector: 'app-info-dialog',
  templateUrl: './info-dialog.component.html',
  styleUrls: ['./info-dialog.component.css'],
  standalone: false
})
export class InfoDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<InfoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: InfoDialogData
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
