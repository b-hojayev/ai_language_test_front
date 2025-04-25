"use client";

import { login } from "@/actions/auth";
import Image from "next/image";
import { useActionState } from "react";

const initialState = {
  message: "",
};

const LoginPage = () => {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <>
      <div className="absolute z-0 w-full h-full top-0 overflow-hidden left-0">
        <Image
          alt="bg-img"
          src={"/login/bg.png"}
          fill
          className="object-cover w-full h-full object-center bg-[rgb(51,49,48)]"
        />
      </div>

      <main className="overflow-hidden relative z-[100000] min-h-screen login-main">
        <div className="p-0 min-[576px]:pt-[40px] pr-0 min-[576px]:pb-[120px] min-[576px]:pl-[60px] w-full min-[576px]:pr-[60px] min-[768px]:pr-0 min-[768px]:w-[85%] h-auto min-[1440px]:pl-[120px]">
          <div className="relative h-full">
            <div className="flex items-center h-auto relative z-10">
              <div className="w-auto relative">
                <Image
                  width={26}
                  height={51}
                  src="/login/logo.png"
                  alt="logo"
                  className="w-[26px] h-[51px]"
                />
              </div>
              <div className="text-[37px] text-white font-bold ml-[8px]">
                Trimba
              </div>
            </div>

            <div className="flex flex-col min-[768px]:flex-row !h-full content-center">
              <div className="flex-1/2 h-full order-2 min-[768px]:order-1">
                <div className="relative w-full p-[30px] mx-auto my-0 mt-[30px] min-[576px]:w-[80%] min-[768px]:w-[40%] min-[768px]:absolute min-[768px]:bottom-0 min-[768px]:left-0 min-[1024px]:w-[33%] min-[1440px]:w-[28%]">
                  <article className="text-white">
                    <span className="text-[18px] min-[576px]:text-[24px] uppercase leading-2">
                      Join Our Marketplace
                    </span>

                    <h1 className="text-[50px] leading-24 min-[576px]:text-[75px] min-[1024px]:text-[104px] font-black uppercase">
                      Company
                    </h1>

                    <p className="text-[14px] min-[576px]:text-[15px] min-[1024px]:text-[18px] leading-6">
                      Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                      Doloribus, quis.
                    </p>
                  </article>
                </div>
              </div>

              <div className="flex-1/2 min-[768px]:w-1/2 order-1 min-[768px]:order-2 w-full form z-50">
                <div className="w-full p-[30px] min-[576px]:my-0 min-[576px]:mx-auto min-[576px]:mt-[30px] min-[768px]:w-[80%] rounded-[12px] bg-white shadow-[0_0_60px_0_rgba(94,92,154,0.12)] min-h-[400px] z-[10000] relative">
                  <h2 className="text-[26px] text-[rgb(48,47,69)] font-bold text-center mb-[70px]">
                    Account Login
                  </h2>

                  <form action={formAction} className="">
                    <div className="input-field reveal">
                      <input
                        id="login"
                        type="text"
                        className=""
                        autoComplete="off"
                        name="name"
                      />
                      <label htmlFor="login" className="">
                        Username
                      </label>
                    </div>

                    <div className="input-field reveal">
                      <input
                        id="password"
                        type="password"
                        className=""
                        autoComplete="off"
                        name="password"
                      />
                      <label htmlFor="password" className="">
                        Password
                      </label>
                    </div>

                    <div>
                      <p className="text-red-600 z-50 font-semibold">
                        {state?.message}
                      </p>
                      <button
                        type="submit"
                        disabled={pending}
                        className="login-btn cursor-pointer rounded-[12px] bg-[rgb(247,144,49)] w-full h-[54px] text-[20px] mb-[40px] border-0 relative text-white font-bold overflow-hidden hover:pl-[65px] transition-all duration-500"
                      >
                        Login
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default LoginPage;
