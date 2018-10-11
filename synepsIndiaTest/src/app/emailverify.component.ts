import { Component } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import {
    NavigationStart, NavigationCancel, NavigationEnd
} from '@angular/router';
import { ApiService } from "src/app/api.service";

@Component({
    selector: 'app-emailverify',
    preserveWhitespaces: false,
    templateUrl: './emailverify.component.html',
    providers: [
        ApiService
    ]
})
export class EmailverifyComponent {

    public verifyStatus: number = 0;
    loading: any;



    constructor(
        private api: ApiService,
        private toaster: ToastrService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
    ) { this.loading = true; }

    public ngOnInit() {
        this.activatedRoute.params.subscribe((param: any) => {
            this.api.verifyAccount({ verifyToken: param['id'] }).subscribe((result: any) => {
                var rs = result;
                if (rs.code == 200) {
                    this.toaster.success("You account has been verified successfully!");
                    this.router.navigate(['']);
                } else if (rs.code == 404) {
                    this.router.navigate(['']);
                    this.toaster.error("Oops! Provided link has been expired!!");
                } else {
                    this.router.navigate(['']);
                    this.toaster.error("Oops! provided key is invalid!");
                }
                
            });
        });
    }
    ngAfterViewInit() {
        this.router.events
            .subscribe((event) => {
                if (event instanceof NavigationStart) {
                    this.loading = true;
                }
                else if (
                    event instanceof NavigationEnd ||
                    event instanceof NavigationCancel
                ) {
                    this.loading = false;
                }
            });
    }
}

