import React, { useEffect } from "react";
import Layout from "components/Layout";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { getError } from "utils/error";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

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
    formState: { errors },
  } = useForm();
  const submitHandler = async ({ email, password }) => {
    try {
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
    <Layout title="Login">
      <form
        className="mx-auto max-w-screen-md"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="mb-4 text-xl">로그인</h1>
        <div className="mb-4">
          <label htmlFor="email">이메일</label>
          <input
            type="email"
            {...register("email", {
              required: "이메일을 입력해주세요",
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                message: "유효한 이메일을 입력해주세요",
              },
            })}
            className="w-full"
            id="email"
            autoFocus
          />
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
              minLength: {
                value: 6,
                message: "최소 6글자 이상을 입력해주세요",
              },
            })}
            className="w-full"
            id="password"
            autoFocus
          />
          {errors.password && (
            <div className="text-red-500">{errors.password.message}</div>
          )}
        </div>
        <div className="mb-4">
          <button className="primary-button">로그인</button>
        </div>
        <div>
          회원이 아니신가요? &nbsp;
          <Link href="register">회원가입</Link>
        </div>
      </form>
    </Layout>
  );
}
