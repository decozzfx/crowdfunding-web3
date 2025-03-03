import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ethers } from "ethers";

import { useStateContext } from "../context";
import { calculateBarPercentage, daysLeft } from "../utils";
import { thirdweb } from "../assets";
import { CButton, CountBox, Loader } from "../components";

const CampaignDetails = () => {
  const { state } = useLocation();

  const stateContext = useStateContext();
  const getDonations = stateContext?.getDonations;
  const contract = stateContext?.contract;
  const addess = stateContext?.address;
  const donate = stateContext?.donate;

  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState(0);
  const [donators, setDonators] = useState<any[]>([]);

  const remainingDays = daysLeft(state.deadline);

  const fetchDonators = async () => {
    if (!getDonations) return;
    const data = await getDonations(state.pId);
    setDonators(data);
  };

  const handleDonate = async () => {
    if (!donate) return;
    setIsLoading(true);
    await donate(state.pId, amount);
    setIsLoading(false);
  };

  useEffect(() => {
    if (contract && addess && getDonations) {
      fetchDonators();
    }
  }, [contract, addess, getDonations]);

  return (
    <div className="">
      {isLoading && <Loader />}

      <div className="w-full flex md:flex-row flex-col mt-10 gap-[30px]">
        <div className="flex-1 flex-col">
          <img
            src={state.image}
            alt="campaign"
            className="w-full h-[410px] object-cover rounded-[15px]"
          />
          <div className="relative w-full h-[5px] bg-[#3a3a43] mt-2">
            <div
              className="absolute h-full bg-[#4acd8d] "
              style={{
                width: calculateBarPercentage(
                  state.target,
                  state.amountCollected
                ),
                maxWidth: "100%",
              }}
            />
          </div>
        </div>

        <div className="flex md:w-[150px] w-full flex-wrap justify-between gap-[30px]">
          <CountBox title="Days Left" value={remainingDays} />
          <CountBox
            title={`Raised of ${state.target}`}
            value={state.amountCollected}
          />
          <CountBox title="Total Backers" value={donators.length.toString()} />
        </div>
      </div>

      <div className="mt-[60px] flex lg:flex-row flex-col gap-5">
        <div className="flex-[2] flex flex-col gap-[40px]">
          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white ">
              Creator
            </h4>
            <div className="mt-[20px] flex flex-row items-center flex-wrap gap-[14px]">
              <div className="w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#2c2f32] cursor-pointer">
                <img
                  src={thirdweb}
                  alt="user"
                  className="w-[60%] h-[60%] object-contain"
                />
              </div>
              <div className="">
                <h4 className="text-white font-epilogue font-semibold text-[14px] break-all">
                  {state.owner}
                </h4>
                <p className="mt-[4px] font-epilogue font-normal text-[12px] leading-[18px] text-[#808191]">
                  10 Campaigns
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white ">
              Story
            </h4>

            <div className="mt-[20px]">
              <p className="font-epilogue font-normal text-[16px] leading-[26px] text-[#808191] text-justify">
                {state.description}
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white ">
              Donators
            </h4>

            <div className="mt-[20px] flex flex-col gap-4">
              {donators.length > 0 ? (
                donators.map((donator, i) => (
                  <div
                    key={`${donator.donator}-${i}`}
                    className="flex justify-between items-center gap-4"
                  >
                    <p className="font-epilogue font-normal text-[16px] leading-[26px] text-[#808191] truncate">
                      {donator.donator}
                    </p>
                    <p className="font-epilogue font-normal text-[16px] leading-[26px] text-[#808191] truncate">
                      {donator.donations}
                    </p>
                  </div>
                ))
              ) : (
                <p className="font-epilogue font-normal text-[16px] leading-[26px] text-[#808191] text-justify">
                  No donators yet. Be the first one!
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1">
          <h4 className="font-epilogue font-semibold text-[18px] text-white ">
            Funds
          </h4>

          <div className="mt-[20px] flex flex-col p-4 bg-[#1c1c24] rounded-[10px]">
            <p className="font-epilogue font-medium text-[18px] leading-[30px] text-[#808191]">
              Fund the campaign
            </p>

            <div className="mt-[30px]">
              <input
                type="number"
                placeholder="ETH 0.1"
                step="0.01"
                className="w-full py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />

              <div className="my-[20px] p-4 bg-[#13131a] justify-center items-center rounded-[10px]">
                <h4 className="font-epilogue font-semibold text-[20px] text-white">
                  Back it because you believe in it
                </h4>
                <p className="font-epilogue font-normal text-[16px] leading-[26px] text-[#808191]">
                  Support the project for no reward, just because it speaks to
                  you
                </p>
              </div>

              <CButton
                btnType="button"
                title="Fund Campaign"
                handleClick={handleDonate}
                styles="w-full bg-[#8c6dfd] hover:bg-[#666e89]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  console.log("🚀 ~ CampaignDetails ~ donators:", donators);
};

export default CampaignDetails;
