import Image from "next/image";
import Layout from "components/Layout";
import Link from "next/link";
import { Router, useRouter } from "next/router";
import React, { useContext } from "react";
import data from "utils/data";
import { Store } from "utils/Store";

export default function ProductScreen() {
  const { state, dispatch } = useContext(Store);
  const router = useRouter();
  const { query } = useRouter();
  const { slug } = query;
  const product = data.products.find((x) => x.slug === slug);

  if (!product) {
    return <div>Product Not Found</div>;
  }

  const addToCartHandler = () => {
    const existItem = state.cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;

    if (product.countInStock < quantity) {
      alert("재고가 부족합니다");
    }
    dispatch({
      type: "CART_ADD_ITEM",
      payload: { ...product, quantity },
    });
    router.push("/cart");
  };

  return (
    <Layout title={product.name}>
      <div className="py-2">
        <Link href="/">홈으로</Link>
      </div>
      <div className="grid md:grid-cols-4 md:gap-3 ">
        <div className="md:col-span-2">
          <Image
            src={product.image}
            alt={product.name}
            width={640}
            height={640}
            priority="false"
          />
        </div>
        <div>
          <ul>
            <li>
              <h1 className="text-lg">{product.name}</h1>
            </li>
            <li>카테고리:{product.category}</li>
            <li>브랜드명:{product.brand}</li>
            <li>
              {product.rating} of {product.numReviews} 리뷰
            </li>
            <li>설명:{product.description}</li>
          </ul>
        </div>
        <div>
          <div className="card p-5">
            <div className="mb-2 flex justify-between">
              <div>가격</div>
              <div>${product.price}</div>
            </div>
            <div className="mb-2 flex justify-between">
              <div>Status</div>
              <div>{product.countInStock > 0 ? "in stock" : "Unavailable"}</div>
            </div>
            <button
              className="primary-button w-full"
              onClick={addToCartHandler}
            >
              장바구니 담기
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
