import React, { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import Layout from "components/Layout";
import { getError } from "utils/error";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import axios from "axios";

export default function LoginScreen() {
  const { data: session } = useSession();

  const router = useRouter();
  const { redirect } = router.query;

  useEffect(() => {
    if (session?.user) {
      router.push(redirect || "/");
    }
  }, [router, session, redirect]);

  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors },
  } = useForm();
  const submitHandler = async ({ name, email, password }) => {
    try {
      await axios.post("/api/auth/signup", {
        name,
        email,
        password,
      });

      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      if (result.error) {
        toast.error(result.error);
      }
    } catch (err) {
      toast.error(getError(err));
    }
  };
  return (
    <Layout title="Create Account">
      <form
        className="mx-auto max-w-screen-md"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="mb-4 text-xl">회원가입</h1>
        <div className="mb-4">
          <label htmlFor="name">이름</label>
          <input
            type="text"
            className="w-full"
            id="name"
            autoFocus
            {...register("name", {
              required: "이름을 입력해주세요",
            })}
          />
          {errors.name && (
            <div className="text-red-500">{errors.name.message}</div>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="email">이메일</label>
          <input
            type="email"
            {...register("email", {
              required: "이메일을 입력해주세요",
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                message: "유효하지 않은 이메일입니다.",
              },
            })}
            className="w-full"
            id="email"
          ></input>
          {errors.email && (
            <div className="text-red-500">{errors.email.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            {...register("password", {
              required: "비밀번호를 입력해주세요",
              minLength: { value: 6, message: "비밀번호는 6글자 이상입니다." },
            })}
            className="w-full"
            id="password"
            autoFocus
          ></input>
          {errors.password && (
            <div className="text-red-500 ">{errors.password.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="confirmPassword">비밀번호 확인</label>
          <input
            className="w-full"
            type="password"
            id="confirmPassword"
            {...register("confirmPassword", {
              required: "비밀번호를 확인해주세요",
              validate: (value) => value === getValues("password"),
              minLength: {
                value: 6,
                message: "6글자 이상의 비밀번호가 맞는지 확인해주세요",
              },
            })}
          />
          {errors.confirmPassword && (
            <div className="text-red-500 ">
              {errors.confirmPassword.message}
            </div>
          )}
          {errors.confirmPassword &&
            errors.confirmPassword.type === "validate" && (
              <div className="text-red-500 ">비밀번호가 일치하지 않습니다</div>
            )}
        </div>

        <div className="mb-4 ">
          <button className="primary-button">회원가입</button>
        </div>
      </form>
    </Layout>
  );
}
