import React, { useState, useEffect } from "react";

import { useStateContext } from "../context";
import { ICampaignData } from "../types/responseTypes";
import { DisplayCampaign } from "../components";

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState<ICampaignData[]>([]);

  const context = useStateContext();
  const address = context?.address;
  const contract = context?.contract;
  const getCampaigns = context?.getCampaigns;

  const fetchCampaigns = async () => {
    if (getCampaigns) {
      setIsLoading(true);
      const data = await getCampaigns();
      setCampaigns(data);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (contract && address && getCampaigns) {
      fetchCampaigns();
    }
  }, [contract, address, getCampaigns]);

  return (
    <div>
      <DisplayCampaign
        title="All Campaigns"
        isLoading={isLoading}
        campaigns={campaigns}
      />
    </div>
  );
};

export default Home;
