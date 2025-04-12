import React, { useState, useContext, useEffect } from "react";
import { DEFAULT_CARDS } from '../../data';
import Column from "../../components/kanban/Column";
import { EstimatesContext } from '../../context/EstimateContext';

const Estimate = () => {
  const [cards, setCards] = useState([]);
  //const [cards, setCards] = useState(DEFAULT_CARDS);
  const { estimates } = useContext(EstimatesContext);

  useEffect(() => {
    setCards(estimates);
  }, [estimates]);
  console.log("estimate in index page", cards);

  return (
    <div className="flex gap-3 overflow-auto h-[642px] p-3">
      <Column
        title="Draft"
        Status="Draft"
        headingColor="text-neutral-700"
        cards={cards}
        setCards={setCards}
      />
      <Column
        title="Sent for approval"
        Status="Sent for approval"
        headingColor="text-yellow-700"
        cards={cards}
        setCards={setCards}
      />
      <Column
        title="Internally Approved"
        Status="Internally Approved"
        headingColor="text-blue-700"
        cards={cards}
        setCards={setCards}
      />
      <Column
        title="Sent to customer"
        Status="Sent to customer"
        headingColor="text-emerald-700"
        cards={cards}
        setCards={setCards}
      />
      <Column
        title="Accepted by customer"
        Status="Accepted by customer"
        headingColor="text-emerald-700"
        cards={cards}
        setCards={setCards}
      />
      <Column
        title="Revised"
        Status="Revised"
        headingColor="text-emerald-700"
        cards={cards}
        setCards={setCards}
      />
      {/* <BurnBarrel setCards={setCards} /> */}
    </div>
  );
};

export default Estimate;