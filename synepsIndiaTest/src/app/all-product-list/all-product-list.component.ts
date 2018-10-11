import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-product-list',
  templateUrl: './all-product-list.component.html',
  styleUrls: ['./all-product-list.component.css']
})
export class AllProductListComponent implements OnInit {
  listAllProduct: any;
  marked = false;
  selectedProducts: string[] = [];

  constructor(private api: ApiService, private toaster: ToastrService, private router: Router, ) { }

  ngOnInit() {
    this.getAllProductList();
  }


  public getAllProductList() {
    this.api.allProductList().subscribe((result) => {
      const rs = result;
      if (rs.code === 200) {
        this.listAllProduct = rs.data.productList;
      } else {
        this.toaster.error(rs.message);
      }
    });
  }

  addProduct(productId: string) {
    this.selectedProducts.push(productId);
  }

  removeProduct(productId: string) {
    const index = this.selectedProducts.indexOf(productId);
    if (index !== -1) {
      this.selectedProducts.splice(index, 1);
    }
  }

  selectProduct(e, productId) {
    this.marked = e.target.checked;
    const product_id = productId;
    if (this.marked === true) {
      this.addProduct(product_id);
    } else {
      this.removeProduct(product_id);
    }
  }


  addMyProduct() {
    if (this.selectedProducts.length === 0) {
      this.toaster.info('Please select atleast one product!');
    } else {
      const data = {
        productList: this.selectedProducts,
        user_id: localStorage.getItem('userData')
      };
      this.api.addMyProduct(data).subscribe((res: any) => {
        if (res.code === 200) {
          this.toaster.success(res.message);
          this.router.navigate(['/myProduct']);
        } else {
          this.toaster.error(res.message);
        }

      });
    }
  }

}
