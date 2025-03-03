import React, { createContext } from "react";
import { prepareContractCall } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";

import {
  useAddress,
  useContract,
  useConnect,
  useContractWrite,
  metamaskWallet,
} from "@thirdweb-dev/react";
import { ICampaignData } from "../types/responseTypes";

import { ethers } from "ethers";

export const metamaskConfig = metamaskWallet();

interface StateContextType {
  createCampaign: (form: any) => Promise<void>;
  getCampaigns: () => Promise<ICampaignData[]>;
  getUserCampaigns: () => Promise<ICampaignData[]>;
  donate: (pId: number, amount: number) => Promise<any>;
  getDonations: (pId: number) => Promise<any>;
  address: string | undefined;
  contract: any;
  connect: (config: any) => void;
}

export const StateContext = createContext<StateContextType | undefined>(
  undefined
);

export const StateContextProvider = ({ children }: any) => {
  const smartcontracAddress = import.meta.env.VITE_TEMPLATE_CLIENT_ID;
  const { contract } = useContract(smartcontracAddress);
  const { mutateAsync: createCampaign } = useContractWrite(
    contract as any,
    "createCampaign"
  );

  const address = useAddress();
  const connect = useConnect();

  const publishCampaign = async (form: any) => {
    try {
      const data = await createCampaign({
        args: [
          address, // owner
          form.title, // title
          form.description, // description
          form.target, // target
          new Date(form.deadline).getTime(), // deadline
          form.image, // image
        ],
      });
    } catch (error) {
      console.log("🚀 ~ publishCampaign ~ error:", error);
    }
  };

  const getCampaigns = async () => {
    const campaigns = await contract?.call("getCmpaigns");

    const parseCampaigns: ICampaignData[] = campaigns.map(
      (campaign: any, i: number) => ({
        owner: campaign.owner,
        title: campaign.title,
        description: campaign.description,
        target: ethers.utils.formatEther(campaign.target.toString()),
        deadline: campaign.deadline.toNumber(),
        amountCollected: ethers.utils.formatEther(
          campaign.amountCollected.toString()
        ),
        image: campaign.image,
        pId: i,
      })
    );
    return parseCampaigns;
  };

  const getUserCampaigns = async () => {
    const allCampaigns = await getCampaigns();

    const filteredCampaigns = allCampaigns.filter(
      (campaign: ICampaignData) => campaign.owner === address
    );

    return filteredCampaigns;
  };

  const donate = async (pId: number, amount: number) => {
    const data = await contract?.call("donateToCampaign", [pId]);
    return data;
  };

  const getDonations = async (pId: number) => {
    const donations = await contract?.call("getDonators", [pId]);
    console.log("🚀 ~ getDonations ~ donations:", donations);
    const numberOfDonations = donations[0].length;

    const parsedDonations: any[] = [];

    for (let i = 0; i < numberOfDonations; i++) {
      parsedDonations.push({
        donator: donations[0][i],
        donations: ethers.utils.formatEther(donations[1][i].toString()),
      });
    }

    return parsedDonations;
  };

  return (
    <StateContext.Provider
      value={{
        address,
        contract,
        connect,
        createCampaign: publishCampaign,
        getCampaigns: getCampaigns,
        getUserCampaigns,
        donate,
        getDonations,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => React.useContext(StateContext);
