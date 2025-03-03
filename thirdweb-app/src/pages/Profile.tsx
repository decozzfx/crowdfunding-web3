import React, { useState, useEffect } from "react";

import { useStateContext } from "../context";
import { ICampaignData } from "../types/responseTypes";
import { DisplayCampaign } from "../components";

const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState<ICampaignData[]>([]);

  const context = useStateContext();
  const address = context?.address;
  const contract = context?.contract;
  const getUserCampaigns = context?.getUserCampaigns;

  const fetchCampaigns = async () => {
    if (getUserCampaigns) {
      setIsLoading(true);
      const data = await getUserCampaigns();
      setCampaigns(data);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (contract && address && getUserCampaigns) {
      fetchCampaigns();
    }
  }, [contract, address, getUserCampaigns]);

  return (
    <div>
      <DisplayCampaign
        title="My Campaigns"
        isLoading={isLoading}
        campaigns={campaigns}
      />
    </div>
  );
};

export default Profile;
