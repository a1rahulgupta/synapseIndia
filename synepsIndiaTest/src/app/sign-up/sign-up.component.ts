import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ApiService } from 'src/app/api.service';
import { ToastrService } from 'ngx-toastr';
import { requiredTrim, matchingPasswords } from 'src/app/validators';

import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  userSignUp: FormGroup;

  constructor(
    private router: Router, private api: ApiService, private formBuilder: FormBuilder, private toaster: ToastrService, private spinnerService: Ng4LoadingSpinnerService ) {

    this.userSignUp = formBuilder.group({
      firstName: ['', [requiredTrim]],
      lastName: ['', [requiredTrim]],
      email: ['', [requiredTrim]],
      password: ['', [requiredTrim, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{6,}')]],
      confirmPassword: ['', [requiredTrim]]
    }, { validator: matchingPasswords('password', 'confirmPassword') });
  }


  ngOnInit() {
  }
  signUp() {
    this.spinnerService.show();
    this.api.signUp(this.userSignUp.value).subscribe((res: any) => {
      if (res.code === 200) {
        this.spinnerService.hide();
        this.toaster.success(res.message);
        this.api.headerData.emit(res);

      } else {

        this.toaster.error(res.message);
      }
      this.userSignUp.reset(this.userSignUp.value);
    });
  }

}
