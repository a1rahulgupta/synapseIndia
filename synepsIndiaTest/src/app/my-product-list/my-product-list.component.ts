import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-product-list',
  templateUrl: './my-product-list.component.html',
  styleUrls: ['./my-product-list.component.css']
})
export class MyProductListComponent implements OnInit {
  listMyProduct: any;

  constructor(private api: ApiService, private toaster: ToastrService, private router: Router ) { }

  ngOnInit() {
    this.getMyProductList();
  }

  public getMyProductList() {
    const data = {
      user_id: localStorage.getItem('userData')
    };
    this.api.getMyProductList(data).subscribe((result) => {
      const rs = result;
      if (rs.code === 200) {
        this.listMyProduct = rs.data.productList.myProducts;
      } else {
        this.toaster.error(rs.message);
      }
    });
  }
  back() {
    this.router.navigate(['/productList']);
  }

}
