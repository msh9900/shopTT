import CheckoutWizard from "components/CheckoutWizard";
import Layout from "components/Layout";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Store } from "utils/Store";

export default function ShippingScreen() {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm();
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const { shippingAddress } = cart;

  useEffect(() => {
    setValue("fullName", shippingAddress.fullName);
    setValue("address", shippingAddress.address);
    setValue("city", shippingAddress.city);
    setValue("postalCode", shippingAddress.postalCode);
    setValue("country", shippingAddress.country);
  }, [setValue, shippingAddress]);

  const submitHandler = ({ fullName, address, city, postalCode, country }) => {
    dispatch({
      type: "SAVE_SHIPPING_ADDRESS",
      payload: { fullName, address, city, postalCode, country },
    });
    Cookies.set(
      "cart",
      JSON.stringify({
        ...cart,
        shippingAddress: {
          fullName,
          address,
          city,
          postalCode,
          country,
        },
      })
    );
    router.push("/payment");
  };
  return (
    <Layout title="Shipping Address">
      <CheckoutWizard activeStep={1} />
      <form
        className="mx-auto max-w-screnen-md"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="mb-4 text-xl">배달 정보</h1>
        <div className="mb-4">
          <label htmlFor="fullName">이름</label>
          <input
            className="w-full"
            id="fullName"
            autoFocus
            {...register("fullName", {
              required: "이름을 입력해주세요",
            })}
          />
          {errors.fullName && (
            <div className="text-red-500">{errors.fullName.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="city">지역</label>
          <input
            className="w-full"
            id="city"
            {...register("city", {
              required: "지역을 입력해주세요",
            })}
          />
          {errors.city && (
            <div className="text-red-500 ">{errors.city.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="address">상세주소</label>
          <input
            className="w-full"
            id="address"
            {...register("address", {
              required: "상세주소를 입력해주세요",
              minLength: { value: 3, message: "3글자 이상 입력하시오." },
            })}
          />
          {errors.address && (
            <div className="text-red-500">{errors.address.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="postalCode">우편번호</label>
          <input
            className="w-full"
            id="postalCode"
            {...register("postalCode", {
              required: "우편번호를 입력해주세요",
            })}
          />
          {errors.postalCode && (
            <div className="text-red-500 ">{errors.postalCode.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="country">국가</label>
          <input
            className="w-full"
            id="country"
            {...register("country", {
              required: "국가를 입력해주세요",
            })}
          />
          {errors.country && (
            <div className="text-red-500 ">{errors.country.message}</div>
          )}
        </div>
        <div className="mb-4 flex justify-between">
          <button className="primary-button">다음</button>
        </div>
      </form>
    </Layout>
  );
}

ShippingScreen.auth = true;
