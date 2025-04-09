import React from 'react';
import { IoIosMail } from 'react-icons/io';
import { FaPhoneAlt } from 'react-icons/fa';
import { FaFacebookF, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import Link from 'next/link';
import Image from 'next/image';
const Footer = () => {
  const data = [
    {
      id: 1,
      icon: <FaFacebookF />,
      href: '#',
    },
    {
      id: 2,
      icon: <FaInstagram />,
      href: '#',
    },
    {
      id: 3,
      icon: <FaLinkedin />,
      href: '#',
    },
    {
      id: 4,
      icon: <FaXTwitter />,
      href: '#',
    },
  ];
  return (
    <div>
      <div
        className="pb-6 bg-right-bottom bg-no-repeat bg-cover"
        style={{
          backgroundImage:
            ' url("/assets/images/india/common/bannerfooter.png")',
        }}
      >
        <div className="container ">
          <div className="pt-16">
            <div className="grid justify-start gap-6 pt-8 pb-12 md:grid-cols-12 md:px-0 md:pt-0">
              <div className="col-span-5 space-y-4">
                <Link href="/">
                  <div>
                    <Image
                      src="/assets/images/india/common/logo-white.png"
                      width={240}
                      height={140}
                      alt="logo-white"
                      style={{ height: 'auto', width: 'auto' }}
                    />
                  </div>
                </Link>
                {/* <p className="text-base leading-relaxed tracking-tighter text-justify text-white md:tracking-tight ">
                                    Lorem Ipsum is simply dummy text of the printing and
                                    typesetting industry. Lorem Ipsum has been the industry.
                                </p> */}
                <div className="space-y-6">
                  {/* <div>
                    <ul className="flex pt-3 space-x-4">
                      {data.map((e, i) => (
                        <li key={i} className="flex space-x-5">
                          <Link
                            href={e.href}
                            target="_blank"
                            className="w-8 p-2 duration-200 bg-white rounded-full hover:scale-110"
                          >
                            {e.icon}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div> */}
                  <ul>
                    <Link href="mailto:info@traveltoindiaservices.com">
                      <li className="flex items-center mt-2 space-x-2 text-base hover:text-primary">
                        <IoIosMail className="w-6 h-6 p-1 text-black bg-white rounded-full" />{' '}
                        <span className="text-white">
                          info@traveltoindiaservices.com
                        </span>
                      </li>
                    </Link>
                    {/* <Link href="#">
                      <li className="flex items-center mt-2 space-x-2 text-base hover:text-primary">
                        <FaPhoneAlt className="w-6 h-6 p-1 text-black bg-white rounded-full" />{" "}
                        <span className="text-white">+91-9876543219</span>
                      </li>
                    </Link> */}
                  </ul>
                </div>
              </div>
              <div className="flex justify-center col-span-2">
                <div className="space-y-6 md:flex md:space-x-28 md:space-y-0">
                  <div>
                    <div className="space-y-6">
                      <h2 className="text-xl font-semibold text-white underline capitalize underline-offset-8 decoration-primary">
                        Quick Links
                      </h2>
                      <ul>
                        <Link href="/">
                          <li className="mt-2 text-base text-white hover:text-primary">
                            <span>Home</span>
                          </li>
                        </Link>
                        <Link href="/">
                          <li className="mt-2 text-base text-white hover:text-primary">
                            <span>About Us</span>
                          </li>
                        </Link>

                        <Link href="/visa/step-one">
                          <li className="mt-2 text-base text-white hover:text-primary">
                            <span>Apply VISA</span>
                          </li>
                        </Link>
                        <Link href="/">
                          <li className="mt-2 text-base text-white hover:text-primary">
                            <span>Ongoing Application</span>
                          </li>
                        </Link>
                        <Link href="/">
                          <li className="mt-2 text-base text-white hover:text-primary">
                            <span>Contact Us</span>
                          </li>
                        </Link>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center col-span-3">
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-white underline capitalize underline-offset-8 decoration-primary">
                    Apply For Indian VISA
                  </h2>
                  <ul>
                    <Link href="/visa/step-one">
                      <li className="mt-2 text-base text-white hover:text-primary">
                        <span> Indian eVisa Online</span>
                      </li>
                    </Link>
                    <Link href="/visa/step-one">
                      <li className="mt-2 text-base text-white hover:text-primary">
                        <span>Indian Tourist eVisa</span>
                      </li>
                    </Link>
                    <Link href="/visa/step-one">
                      <li className="mt-2 text-base text-white hover:text-primary">
                        <span>Indian Medical eVisa</span>
                      </li>
                    </Link>
                    <Link href="/visa/step-one">
                      <li className="mt-2 text-base text-white hover:text-primary">
                        <span> Indian Business eVisa</span>
                      </li>
                    </Link>
                  </ul>
                </div>
              </div>
              <div className="flex justify-end col-span-2 ">
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-white underline capitalize underline-offset-8 decoration-primary">
                    Support
                  </h2>
                  <ul>
                    <Link href="/terms-and-conditions">
                      <li className="mt-2 text-base text-white hover:text-primary">
                        <span> Terms & Conditions</span>
                      </li>
                    </Link>
                    <Link href="/privacy-policy">
                      <li className="mt-2 text-base text-white hover:text-primary">
                        <span>Privacy Policy</span>
                      </li>
                    </Link>
                    <Link href="/cookie-policy">
                      <li className="mt-2 text-base text-white hover:text-primary">
                        <span>Cookies Policy</span>
                      </li>
                    </Link>
                    <Link href="/cancellation-and-refund-policy">
                      <li className="mt-2 text-base text-white hover:text-primary">
                        <span>Cancellation and Refund Policy</span>
                      </li>
                    </Link>
                  </ul>
                </div>
              </div>
            </div>
            <hr className="h-[1px] bg-primary border-primary" />
            <div className="px-5 py-5 text-base text-center text-white md:px-0">
              <p>
                {' '}
                Copyright © 2023 |
                <span className="px-2 font-semibold">E-Visa</span>| All Rights
                Reserved
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
