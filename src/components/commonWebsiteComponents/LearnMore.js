import React from 'react';
import Link from 'next/link';
import UnderlineTextCenter from '../australia/common/UnderlineTextCenter';

const LearnMore = ({ learnMoreSectionData }) => {
  const { sections } = learnMoreSectionData;
  return (
    <div className="">
      <div className="container py-16">
        <div className="space-y-4 md:text-center">
          <div>
            <UnderlineTextCenter title="Learn More" />
          </div>

          {sections?.map((section, index) => (
            <>
              <div className={`${section?.image ? 'flex space-x-5 ' : ''}`}>
                <div className={`${section?.image ? 'w-full text-left' : ''}`}>
                  <div className="flex justify-start pt-10" key={index}>
                    <h2 className="md:text-3xl text-2xl text-black">
                      {section?.title}
                    </h2>
                  </div>
                  {section?.paragraphs?.map((paragraph, index) => (
                    <>
                      <p className="text-left pt-4" key={index}>
                        {paragraph?.text}
                      </p>
                    </>
                  ))}

                  {section?.lists?.map((list, index) => (
                    <div key={index}>
                      <div className="text-left py-4">{list?.title}</div>
                      <ul className="list-disc flex flex-col items-start justify-start ">
                        {list?.listItems?.map((item, index) => (
                          <>
                            <li className="text-left py-1" key={index}>
                              {item}
                            </li>
                          </>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                {!!section?.image && (
                  <div className={`${section?.image ? 'w-full' : ''}`}>
                    <img
                      src="/assets/images/australia/visainfo.png"
                      className="w-full object-cover h-[250px] object object-center rounded-lg"
                    />
                  </div>
                )}
              </div>
            </>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LearnMore;
