import { Component, AfterViewInit, ViewChild, ViewChildren } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormArray, FormBuilder, Validators, FormControl } from '@angular/forms';
/*
  Custom validators to use everywhere.
*/
// FORM GROUP VALIDATORS
export function matchingPasswords(passwordKey: string, cpasswordKey: string) {
  return (group: FormGroup): { [key: string]: any } => {

    let password = group.controls[passwordKey];
    let cpassword = group.controls[cpasswordKey];

    if (password.value !== cpassword.value) {
      return {
        mismatchedPasswords: true
      };
    }
  }
}

export function requiredTrim(fieldControl: FormControl) {
  return (!fieldControl.value) || (typeof (fieldControl.value) == 'string' && fieldControl.value.trim() == "") ?
    { "requiredTrim": true } : null;
}

export function ipRange(fieldControl: FormControl) {
  let ips = fieldControl.value.split('-');
  let ipPattern = /^(\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b)$/;
  if (ips.length == 2) {
    if (ipPattern.test(ips[0]) && ipPattern.test(ips[1])) {
      let ip1 = ips[0].split('.');
      let ip2 = ips[1].split('.');
      if (ip1[0] == ip2[0] && ip1[1] == ip2[1] && ip1[2] == ip2[2] && parseInt(ip1[3]) < parseInt(ip2[3])) {
        return null;
      } else {
        return { "ipRange": true }
      }
    } else {
      return { "ipRange": true }
    }
  } else {
    return null;
  }
}
