'use client';
import PartiallyFillForm from '@/components/homePage/PartiallyFillForm';
import PaymentForCompletedForm from '@/components/homePage/PaymentForCompletedForm';
import VisaStatusForm from '@/components/homePage/VisaStatusForm';
import ApplySection from '@/components/india/homepage/ApplySection';
import Banner from '@/components/india/homepage/Banner';
import { useFormContext } from '@/context/formContext';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const Home = () => {
  const { resetForm } = useFormContext();
  const [isPaymentForCompletedFormOpen, setPaymentForCompletedFormOpen] =
    useState(false);
  const [isPartiallyFillFormOpen, setPartiallyFillFormOpen] = useState(false);
  const [isVisaStatusFormOpen, setVisaStatusFormOpen] = useState(false);

  const handlePartiallyFillFormOpen = () => {
    setPartiallyFillFormOpen(prev => !prev);
  };

  const handlePaymentForCompletedFormOpen = () => {
    setPaymentForCompletedFormOpen(prev => !prev);
  };

  const handleVisaStatusFormOpen = () => {
    setVisaStatusFormOpen(prev => !prev);
  };

  useEffect(() => {
    console.log('Resetting form state on home page');
    resetForm();
  }, [resetForm]);

  return (
    <>
      <div>
        <Banner />
        {/* {''} */}
        <div className="container grid w-full font-medium text-center my-7">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Link href="/visa/step-one" className="flex flex-col h-full">
              <button className="flex-1 w-full p-3 text-sm text-white duration-150 ease-in-out rounded md:p-3 bg-orange hover:scale-105">
                Apply For INDIA
              </button>
            </Link>
            <button
              onClick={() => setPartiallyFillFormOpen(true)}
              className="w-full p-3 text-sm text-white duration-150 ease-in-out rounded bg-pink hover:scale-105"
            >
              Amend or Complete Partially
              <br />
              Filled Form
            </button>
            <button
              onClick={() => setPaymentForCompletedFormOpen(true)}
              className="w-full p-3 text-sm text-white duration-150 ease-in-out rounded bg-success hover:scale-105"
            >
              Make Payment for Completed
              <br /> Form
            </button>
            <button
              onClick={() => setVisaStatusFormOpen(true)}
              className="w-full p-3 text-sm text-white duration-150 ease-in-out rounded bg-brown hover:scale-105"
            >
              Visa Status Enquiry
            </button>
          </div>
        </div>
        <ApplySection />
      </div>
      {/* modal start  */}

      {/* updated modal 1 */}
      <PartiallyFillForm
        isFormModalOpen={isPartiallyFillFormOpen}
        handleFormModal={handlePartiallyFillFormOpen}
      />
      {/* payment for completed form  */}
      <PaymentForCompletedForm
        isFormModalOpen={isPaymentForCompletedFormOpen}
        handleFormModal={handlePaymentForCompletedFormOpen}
      />

      {/* check visa status */}
      <VisaStatusForm
        isFormModalOpen={isVisaStatusFormOpen}
        handleFormModal={handleVisaStatusFormOpen}
      />
    </>
  );
};

export default Home;
