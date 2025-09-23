import React, { forwardRef, useImperativeHandle } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
// Import logo properly
import logo from "../assets/images/logo.png";

const ContractPDFGenerator = forwardRef(({ contractData }, ref) => {
  useImperativeHandle(ref, () => ({
    generatePDF: async () => {
      try {
        const pages = document.querySelectorAll(".contract-page");
        const pdf = new jsPDF("p", "mm", "a4");

        for (let i = 0; i < pages.length; i++) {
          if (i > 0) pdf.addPage();

          const canvas = await html2canvas(pages[i], {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: "#ffffff",
            width: pages[i].offsetWidth,
            height: pages[i].offsetHeight,
          });

          const imgData = canvas.toDataURL("image/png");
          const imgWidth = 210;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
        }

        const firstUserName = contractData?.userInfo?.[0]?.name || "Document";
        const fileName = `Contract_${firstUserName.replace(
          /[^a-zA-Z0-9]/g,
          "_"
        )}.pdf`;
        pdf.save(fileName);
        return pdf;
      } catch (error) {
        console.error("Error generating PDF:", error);
        throw error;
      }
    },
  }));

  // Get current date for signing
  const getCurrentDate = () => {
    const date = new Date();
    return date
      .toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
      .toUpperCase();
  };

  // Calculate contract end date (23 years from start)
  const getEndDate = () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 23);
    return date
      .toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
      .toLowerCase();
  };

  const getStartDate = () => {
    const date = new Date();
    return date
      .toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
      .toLowerCase();
  };

  const LogoHeader = ({ pageNumber }) => (
    <div className="flex justify-between items-start mb-6">
      <div className="flex items-center">
        <img
          src={logo}
          alt="Future Life PT Logo"
          className="w-24 h-24 mr-3 object-contain"
          onError={(e) => {
            e.target.style.display = "none";
            e.target.nextSibling.style.display = "flex";
          }}
        />
        <div
          className="w-10 h-10 bg-yellow-400 rounded flex items-center justify-center"
          style={{ display: "none" }}
        >
          <span className="text-white font-bold text-xs">FL</span>
        </div>
      </div>
      <div className="text-right">
        <div className="text-sm font-medium">Furnished (1) Bed-Room basic</div>
      </div>
    </div>
  );

  const PageFooter = ({ pageNumber }) => (
    <div className="flex justify-between items-center mt-auto pt-4">
      <span className="text-xs">Please sign each page</span>
      <span className="text-xs">{pageNumber}</span>
    </div>
  );

  return (
    <div
      className="contract-container"
      style={{ position: "absolute", left: "-9999px", top: "0" }}
    >
      {/* PAGE 1 - MAIN CONTRACT PAGE */}
      <div
        className="contract-page bg-white p-12 min-h-[297mm] flex flex-col"
        style={{ width: "210mm", fontSize: "12px", lineHeight: "1.5" }}
      >
        <LogoHeader pageNumber={1} />

        <div className="text-center mb-6">
          <h1 className="text-lg font-bold mb-2">
            (Future life PT) My Future Life Bali: My Secret Home Bali
          </h1>
        </div>

        <div className="mb-4 text-red-600">
          <div>length of contract 23 years</div>
          <div>starting from: {getStartDate()},</div>
          <div>Ending date: {getEndDate()}.</div>
        </div>

        <div className="mb-4">
          <div>On this day …{getCurrentDate()}, the undersigned are:</div>
        </div>

        <div className="mb-6 text-red-600">
          <div>Villa price: $ {contractData?.totalAmount || 32000}</div>
          <div>
            Initial payment 90% of Villa price ${" "}
            {Math.round((contractData?.totalAmount || 32000) * 0.9)} needs to be
            paid or within 2 weeks now and the rest 10% 2 weeks after completion
          </div>
        </div>

        {/* FIRST PARTY - ALL USERS */}
        <div className="mb-6">
          <div className="font-bold mb-2">FIRST PARTY:</div>
          <div className="ml-4">
            {contractData?.userInfo?.length > 0 ? (
              contractData.userInfo.map((user, index) => (
                <div
                  key={index}
                  className="mb-4 pb-2 border-b border-gray-200 last:border-b-0"
                >
                  {contractData.userInfo.length > 1 && (
                    <div className="font-semibold text-sm mb-1">
                      Person {index + 1}:
                    </div>
                  )}
                  <div>• Name: Ms & Mr ({user.name})</div>
                  <div>• Date of Birth: ({user.dob})</div>
                  <div>• Address: ({user.address})</div>
                  <div>• Country: ({user.country})</div>
                  <div>• Email: ({user.email})</div>
                  <div>• Phone: ({user.phone})</div>
                  <div>• ID/Passport Nr: ({user.passportId})</div>
                </div>
              ))
            ) : (
              <div>
                <div>• Name: Ms & Mr (………)</div>
                <div>• Date of Birth: (… ……)</div>
                <div>• Address: (… ……)</div>
                <div>• ID/Passport Nr: (… ……)</div>
              </div>
            )}
          </div>
        </div>

        <div className="mb-6">
          <div className="font-bold mb-2">SECOND PARTY:</div>
          <div className="ml-4">
            <div>• Company Name: _______________future life PT</div>
            <div>• Represented by :___ ___________DIRECTOR____________</div>
            <div>
              • Address: _my secret home__jl.courtyard 1 _ Seminyak , bali
            </div>
            <div>• Company id number:__</div>
          </div>
        </div>

        <div className="mb-4">
          FIRST PARTY, acting on behalf of{" "}
          {contractData?.userInfo?.length > 1
            ? "themselves"
            : "himself/herself"}
          , hereinafter referred to as "
          {contractData?.userInfo?.length > 0
            ? contractData.userInfo.map((user) => user.name).join(" & ")
            : "………"}
          ".
        </div>

        <div className="mb-4">
          SECOND PARTY acting on behalf of itself, hereinafter referred to as
          "My Future Life Bali".
        </div>

        <div className="mb-4">
          The PARTIES agree to enter into a Business Cooperation to develop a
          complex villa business, under the terms and conditions outlined in the
          following articles.
        </div>

        <PageFooter pageNumber={1} />
      </div>

      {/* PAGE 2 - Article 1a: SCOPE */}
      <div
        className="contract-page bg-white p-12 min-h-[297mm] flex flex-col"
        style={{ width: "210mm", fontSize: "12px", lineHeight: "1.5" }}
      >
        <LogoHeader pageNumber={2} />

        <h2 className="text-lg font-bold mb-4">Article 1a: SCOPE</h2>

        <div className="mb-4">
          The "
          {contractData?.userInfo?.length > 0
            ? contractData.userInfo.map((user) => user.name).join(" & ")
            : "………"}
          " hereby agrees to pay $ USD{contractData?.totalAmount || 32000} to
          "My Future Life Bali" for costs:
        </div>

        <div className="mb-4 ml-4">
          <div>• Construction</div>
          <div>
            • Fully Furnished (Furnishing are paid by future life PT & owned by
            future life PT)
          </div>
          <div>• 1 bedroom</div>
          <div>• 1 bathroom and bathtub (semi outside)</div>
          <div>• 1 outdoor kitchen</div>
          <div>• Garden of minimum 80 meters²</div>
          <div>• Rooftop or semi 65 m² or above 65²</div>
          <div>
            • Land area will be above 155m² total land with construction and all
          </div>
          <div>
            • All that are requested by the customer as and Add-ons are on the
            receipt and are added on top of what is mentioned here, can be found
            in ATTACHMENT A
          </div>
        </div>

        <div className="mb-4">
          If additional pool is wished that will be 4500 usd on top of the
          original Price
        </div>
        <div className="mb-4">
          pool (yes or no) (
          {contractData?.selectedAddOns?.some((addon) =>
            addon.room?.toLowerCase().includes("pool")
          )
            ? "yes"
            : "no"}
          )
        </div>

        <div className="mb-4">
          Additional cost and ADD ONS coming in the bottom of the document as
        </div>
        <div className="mb-4">attachment A ADD ONS</div>

        <div className="mb-6">
          Both parties agree to share the profits equally: 50% for '
          {contractData?.userInfo?.length > 0
            ? contractData.userInfo.map((user) => user.name).join(" & ")
            : "………"}
          ' and 50% for 'My Future Life Bali'."
        </div>

        <h3 className="text-base font-bold mb-2">Article 1b this time only</h3>
        <div className="mb-6">
          The parties agree that, for this time only, '
          {contractData?.userInfo?.length > 0
            ? contractData.userInfo.map((user) => user.name).join(" & ")
            : "………"}
          ' will pay 90% of $ mentioned above initially. before we start. And
          the rest 10% after start
        </div>

        <h3 className="text-base font-bold mb-2">
          Article 1c length of contract and Lease
        </h3>
        <div className="mb-2">The term of this agreement is 23 years,</div>
        <div className="mb-2">
          The rental of the land for the 23-year period is covered by the
          Payment that is mentioned payment, valid until : date mentioned
          beginning of the contract
        </div>
        <div>
          For the lease $500 needs to be paid after 8 years to cover the last 15
          years of the 23 year total lease period.
        </div>

        <PageFooter pageNumber={2} />
      </div>

      {/* PAGE 3 - Article 1d & 2a & 2b */}
      <div
        className="contract-page bg-white p-12 min-h-[297mm] flex flex-col"
        style={{ width: "210mm", fontSize: "12px", lineHeight: "1.5" }}
      >
        <LogoHeader pageNumber={3} />

        <h3 className="text-base font-bold mb-2">
          Article 1d Responsibilities Clause of My future Life
        </h3>
        <div className="mb-4">
          My future Life party acknowledges and agrees to undertake and be fully
          responsible for all aspects of the management, marketing, and
          day-to-day operations for a period of 23 years, commencing on [start
          date] and concluding on [end date]. And it is the only party that can
          decide on this , My future Life can allocate the responsibilities
          under another management in the future and still be responsible for My
          future Life.
        </div>

        <div className="mb-2">
          These responsibilities include but are not limited to:
        </div>
        <div className="mb-4 ml-4">
          <div>1. Managing all bookings and reservations.</div>
          <div>
            2. Overseeing and executing marketing strategies to promote the
            property.
          </div>
          <div>
            3. Handling all day-to-day operational activities to ensure smooth
            functioning.
          </div>
          <div>
            4. Arranging and supervising necessary maintenance and repairs as
            required.
          </div>
          <div>
            5. Managing the rental process, including tenant relations and
            contract oversight.
          </div>
        </div>

        <div className="mb-6">
          The undersigned shall perform these duties with diligence, integrity,
          and professionalism, ensuring the property operates efficiently and
          profitably throughout the specified term.
        </div>

        <h3 className="text-base font-bold mb-2">
          Article 2a: PAYMENT OF PROFIT
        </h3>
        <div className="mb-6">
          The profit of the "
          {contractData?.userInfo?.length > 0
            ? contractData.userInfo.map((user) => user.name).join(" & ")
            : "………"}
          " will be paid to a **** bank account via bank transfer every 3
          months.
        </div>

        <h3 className="text-base font-bold mb-2">
          Article 2b : no contact / inheritance
        </h3>
        <div className="font-bold mb-2 underline">No contact</div>
        <div className="mb-4">
          If there is no contact from '
          {contractData?.userInfo?.length > 0
            ? contractData.userInfo.map((user) => user.name).join(" & ")
            : "………"}
          ' to 'My Future Life Bali' for 9-12 months, 'My Future Life Bali' must
          attempt to contact '
          {contractData?.userInfo?.length > 0
            ? contractData.userInfo.map((user) => user.name).join(" & ")
            : "………"}
          's relatives or the appropriate embassy.
        </div>

        <div className="mb-4">
          Please mention 2 contact with phone number in NO CONTACT EMERGENCY
          ATTACHMENT D
        </div>

        <div className="font-bold mb-2 underline">inheritance</div>
        <div>
          • "If there is no contact from '
          {contractData?.userInfo?.length > 0
            ? contractData.userInfo.map((user) => user.name).join(" & ")
            : "………"}
          ' to 'My Future Life Bali' for 9-12 months, 'My Future Life Bali' must
          attempt to contact '
          {contractData?.userInfo?.length > 0
            ? contractData.userInfo.map((user) => user.name).join(" & ")
            : "………"}
          's relatives or the appropriate embassy.
        </div>

        <PageFooter pageNumber={3} />
      </div>

      {/* PAGE 4 - Inheritance continuation & Article 2c */}
      <div
        className="contract-page bg-white p-12 min-h-[297mm] flex flex-col"
        style={{ width: "210mm", fontSize: "12px", lineHeight: "1.5" }}
      >
        <LogoHeader pageNumber={4} />

        <div className="mb-4">
          • If '
          {contractData?.userInfo?.length > 0
            ? contractData.userInfo.map((user) => user.name).join(" & ")
            : "………"}
          ' passes away, the profit will be paid to the inheritor mentioned in
          their will..
        </div>

        <div className="mb-4">
          • If no inheritor is mentioned, 'My Future Life Bali' will distribute
          the profit as follows: If '
          {contractData?.userInfo?.length > 0
            ? contractData.userInfo.map((user) => user.name).join(" & ")
            : "………"}
          ' has parents, siblings, or any other designated persons listed in
          this contract, the profit will be paid to them in the specified order
          and percentages. If no such persons are listed or available, the
          profit distribution will follow applicable inheritance laws.
        </div>

        <div className="mb-4">
          • The term 'children' refers to all children of the couple, and the
          profit will be distributed equally among them."
        </div>

        <div className="mb-6">
          The designated inheritors and their respective shares are: ATTACHMENT
          C INHERITANCE
        </div>

        <h3 className="text-base font-bold mb-2">
          Article 2c Guarantor Profit Sharing and ROI Terms first 2 years
        </h3>

        <div className="mb-2">1. Income calculation %</div>
        <div className="mb-4 ml-4">
          • ROI calculation will begin 3 months after the construction period
          ends and the project is launched in the market.
        </div>

        <div className="mb-2">2. Income Below 6%</div>
        <div className="mb-4 ml-4">
          <div>
            • "If the project does not generate an income of at least 6%, with
            70%/30% profit sharing to '
            {contractData?.userInfo?.length > 0
              ? contractData.userInfo.map((user) => user.name).join(" & ")
              : "………"}
            ' and 30% to 'My Future Life Bali', please read article 2D
          </div>
          <div>
            • '
            {contractData?.userInfo?.length > 0
              ? contractData.userInfo.map((user) => user.name).join(" & ")
              : "………"}
            ' has the right to withdraw and request a 75% refund of the initial
            investment , will be returned.
          </div>
          <div>
            • '
            {contractData?.userInfo?.length > 0
              ? contractData.userInfo.map((user) => user.name).join(" & ")
              : "………"}
            ' will allow a 6-month period for 'My Future Life Bali' to repay the
            amount."
          </div>
        </div>

        <div className="mb-2">3. Term Validity of Article 2c</div>
        <div className="mb-6 ml-4">
          • "This article of the contract is valid only for the first 2 years of
          the agreement."
        </div>

        <h3 className="text-base font-bold">
          Article 2D Profit Sharing and ROI Terms after first 0 years till year
          20
        </h3>

        <PageFooter pageNumber={4} />
      </div>

      {/* PAGE 5 - Article 2D & 2e */}
      <div
        className="contract-page bg-white p-12 min-h-[297mm] flex flex-col"
        style={{ width: "210mm", fontSize: "12px", lineHeight: "1.5" }}
      >
        <LogoHeader pageNumber={5} />

        <div className="mb-8">
          • If the return on investment (ROI) is below 12% from year 0 to year
          20, '
          {contractData?.userInfo?.length > 0
            ? contractData.userInfo.map((user) => user.name).join(" & ")
            : "………"}
          ' will receive 70% of the profit instead of 50%, and 'My Future Life
          Bali' will receive 30%.
        </div>

        <h3 className="text-base font-bold mb-2">
          Article 2e Guarantor Clause: during construction period
        </h3>

        <div className="mb-2">1. Guarantor Obligation:</div>
        <div className="mb-4 ml-4">
          • My Secret Home will act as a guarantor only during the construction
          period, which shall not exceed six (6) months. The guarantor
          obligation ends either upon the completion of the construction or when
          the property is launched for rental in the market, whichever occurs
          first.
        </div>

        <div className="mb-2">2. Completion Guarantee:</div>
        <div className="mb-4 ml-4">
          • If the construction is not completed within the six (6) month
          period, My Secret Home will ensure the full repayment of the invested
          amount plus an additional $ USD 500 to the "
          {contractData?.userInfo?.length > 0
            ? contractData.userInfo.map((user) => user.name).join(" & ")
            : "………"}
          ".
        </div>

        <div className="mb-2">3. Repayment Method:</div>
        <div className="mb-4 ml-4">
          • The repayment, including the additional $ USD 500, will be
          facilitated by My Secret Home. The "
          {contractData?.userInfo?.length > 0
            ? contractData.userInfo.map((user) => user.name).join(" & ")
            : "………"}
          " will be entitled to 30% of the revenue generated by My Secret Home
          until the full amount, including the additional $ USD 500, is paid.
        </div>

        <div className="mb-2">4. Transparency and Reporting:</div>
        <div className="mb-4 ml-4">
          • From the start date of this clause, the "
          {contractData?.userInfo?.length > 0
            ? contractData.userInfo.map((user) => user.name).join(" & ")
            : "………"}
          " shall have the right to access and review the full income records of
          My Secret Home to ensure transparency and accurate repayment
          calculations.
        </div>

        <PageFooter pageNumber={5} />
      </div>

      {/* PAGE 6 - Article 2f Contingency Fund */}
      <div
        className="contract-page bg-white p-12 min-h-[297mm] flex flex-col"
        style={{ width: "210mm", fontSize: "12px", lineHeight: "1.5" }}
      >
        <LogoHeader pageNumber={6} />

        <h3 className="text-base font-bold mb-2">
          Article 2f Contingency Fund /Replenishment of Fund:
        </h3>

        <div className="mb-2 font-medium">
          Establishment of Contingency Fund:
        </div>
        <div className="mb-4">
          1. A contingency fund (the "Fund") shall be established to cover
          unforeseen future expenses or emergencies.
        </div>

        <div className="mb-2 font-medium">Fund Amount:</div>
        <div className="mb-4">
          2. The target amount for the Fund is set at two thousand USD (USD
          2000).
        </div>

        <div className="mb-2 font-medium">Monthly Contributions:</div>
        <div className="mb-4">
          3. The contingency fund shall be built up over time with monthly
          contributions from '
          {contractData?.userInfo?.length > 0
            ? contractData.userInfo.map((user) => user.name).join(" & ")
            : "………"}
          's profit. Each month, an average of seventy USD (70) shall be set
          aside from '
          {contractData?.userInfo?.length > 0
            ? contractData.userInfo.map((user) => user.name).join(" & ")
            : "………"}
          's profit until the fund reaches the target amount of average of USD
          2000, till we reach 35 million Indonesian Rupiah (IDR 35,000,000). And
          will increase by 10% every year
        </div>

        <div className="mb-2 font-medium">Utilization of Fund:</div>
        <div className="mb-4">
          4. In the event of any contingency or unforeseen expense, the cost
          shall be covered equally from the profits of both '
          {contractData?.userInfo?.length > 0
            ? contractData.userInfo.map((user) => user.name).join(" & ")
            : "………"}
          ' and 'My Future Life Bali'. The necessary amount will be withdrawn
          from the contingency fund to cover these expenses.
        </div>

        <div className="mb-4">
          5. If the profit-sharing arrangement is 60/40 with '
          {contractData?.userInfo?.length > 0
            ? contractData.userInfo.map((user) => user.name).join(" & ")
            : "………"}
          ' receiving 60%, then '
          {contractData?.userInfo?.length > 0
            ? contractData.userInfo.map((user) => user.name).join(" & ")
            : "………"}
          ' will pay 60% of the unforeseen expenses from the contingency fund.
        </div>

        <PageFooter pageNumber={6} />
      </div>

      {/* PAGE 7 - Article 2g On-Plan Purchase & Article 3 Force Majeure */}
      <div
        className="contract-page bg-white p-12 min-h-[297mm] flex flex-col"
        style={{ width: "210mm", fontSize: "12px", lineHeight: "1.5" }}
      >
        <LogoHeader pageNumber={7} />

        <h3 className="text-base font-bold mb-2">
          Article 2g : On-Plan Purchase Clause
        </h3>

        <div className="mb-2">1. Reservation and Initial Payment</div>
        <div className="mb-4 ml-4">
          ○ A non-refundable deposit of $8,000 USD is required upfront to
          reserve an On-plan villa.
        </div>

        <div className="mb-2">2. Construction and Buyer's Option</div>
        <div className="mb-4 ml-4">
          <div>○ The villa will be constructed,,,</div>
          <div>
            ○ design and specifications will in full control of 'My Future Life
            Bali, 'and My Future Life Bali will decide on the design and
            specifications
          </div>
          <div>
            ○ Upon completion, the buyer has the option to proceed with the
            purchase or withdraw from the agreement.
          </div>
        </div>

        <div className="mb-2">3. Withdrawal and Price Adjustment</div>
        <div className="mb-4 ml-4">
          <div>
            ○ If the buyer decides not to proceed with the purchase after
            construction, the initial $8,000 USD deposit is forfeited.
          </div>
          <div>
            ○ Additionally, if the buyer chooses to proceed with the purchase,
            the total price of the villa will increase by $4,000 USD.
          </div>
        </div>

        <div className="mb-2">4. Activation of Clause</div>
        <div className="mb-4 ml-4">
          ○ This clause is only valid on the day of sign-up and cannot be
          applied retroactively or modified thereafter.
        </div>

        <div className="mb-2">Want On-Plan Purchase yes or no: ( no )</div>
        <div className="mb-6">
          If "My Future Life Bali" has not or will not mentioned above it is
          automatically no
        </div>

        <h3 className="text-base font-bold mb-2">
          Article 3: DAMAGE AND NATURAL DISASTER "FORCE MAJEURE"
        </h3>
        <div className="mb-2">
          The "My Future Life Bali" is released from any compensation or demands
          from the "
          {contractData?.userInfo?.length > 0
            ? contractData.userInfo.map((user) => user.name).join(" & ")
            : "………"}
          " due to damage to the building caused by force majeure. Force majeure
          includes:
        </div>
        <div className="ml-4">
          • including but not limited to acts of God, natural disasters (such as
          floods, earthquakes, hurricanes), war, terrorism, riots, embargoes,
          governmental actions, strikes, labor disputes, or other industrial
          disturbances, fire, pandemics, or any other cause, whether similar or
          dissimilar to the foregoing
        </div>

        <PageFooter pageNumber={7} />
      </div>

      {/* PAGE 8 - Articles 4-8 & Signatures */}
      <div
        className="contract-page bg-white p-12 min-h-[297mm] flex flex-col"
        style={{ width: "210mm", fontSize: "12px", lineHeight: "1.5" }}
      >
        <LogoHeader pageNumber={8} />

        <h3 className="text-base font-bold mb-2">Article 4: OTHER MATTERS</h3>
        <div className="mb-6">
          Matters not included in this agreement will be discussed jointly by
          both parties.
        </div>

        <h3 className="text-base font-bold mb-2">
          Article 5: DISPUTE RESOLUTION
        </h3>
        <div className="mb-6">
          For this agreement and all its consequences, both parties agree to
          choose a permanent domicile at the Denpasar District Court.
        </div>

        <h3 className="text-base font-bold mb-2">
          Article 6: USD Vs Indonesian Rupiah
        </h3>
        <div className="mb-6">
          The USD mentioned is the price for the product /package. Payments will
          be made in Rupiah, and all calculations, including ROI on investment,
          will be based on Rupiah relative to the amount received by My Future
          Life Bali.
        </div>

        <h3 className="text-base font-bold mb-2">
          Article 7a: "
          {contractData?.userInfo?.length > 0
            ? contractData.userInfo.map((user) => user.name).join(" & ")
            : "………"}
          "s right for 28 days stay per year at the property
        </h3>
        <div className="mb-6">
          "
          {contractData?.userInfo?.length > 0
            ? contractData.userInfo.map((user) => user.name).join(" & ")
            : "………"}
          " is entitled to stay at the property for 28 days each year. These 28
          days can be transferred to family members for their use as well. The
          28 days can be divided into 4 separate bookings throughout the year.
          Furthermore, these 28 days cannot be used for commercial rental
          purposes. This gives no right to cancel other guest booking,,, nor can
          this be transferred to other years without the permission of my future
          life management. And the 28 days can not be used under peak season
        </div>

        <h3 className="text-base font-bold mb-2">Article 8: Confidentiality</h3>
        <div className="mb-6">
          Both parties agree to maintain the confidentiality of any proprietary
          or sensitive information exchanged during the term of this Contract.
        </div>

        <div className="mb-6">
          This agreement is made in 2 (two) copies, sufficiently stamped, and
          having the same legal force, signed by both parties.
        </div>

        <div className="flex justify-between mt-8">
          <div>
            <div className="font-bold">FIRST PARTY</div>
            <div className="mt-12 border-b border-gray-400 w-48"></div>
          </div>
          <div>
            <div className="font-bold">SECOND PARTY</div>
            <div className="mt-4">Future life (PT)</div>
            <div className="mt-8 border-b border-gray-400 w-48"></div>
            <div className="mt-2">DIRECTOR</div>
          </div>
        </div>

        <PageFooter pageNumber={8} />
      </div>

      {/* PAGE 9 - BLANK PAGE */}
      <div
        className="contract-page bg-white p-12 min-h-[297mm] flex flex-col"
        style={{ width: "210mm", fontSize: "12px", lineHeight: "1.5" }}
      >
        <LogoHeader pageNumber={9} />
        <PageFooter pageNumber={9} />
      </div>

      {/* PAGE 10 - Attachment A ADD ONS */}
      <div
        className="contract-page bg-white p-12 min-h-[297mm] flex flex-col"
        style={{ width: "210mm", fontSize: "12px", lineHeight: "1.5" }}
      >
        <LogoHeader pageNumber={10} />

        <h3 className="text-base font-bold mb-6">Attachment A ADD ONS</h3>

        <div className="mb-6">
          <div className="font-medium mb-2">Pool</div>
          <div className="mb-2">
            If additional pool is wished that will be 4500 usd on top of the
            original Price
          </div>
          <div>
            Wish pool (yes or no):{" "}
            {contractData?.selectedAddOns?.some((addon) =>
              addon.room?.toLowerCase().includes("pool")
            )
              ? "yes"
              : "no"}
          </div>
        </div>

        <div className="mb-4">
          <div className="font-medium mb-2">Other addons</div>
          {contractData?.selectedAddOns?.length > 0 ? (
            contractData.selectedAddOns.map((addon, index) => (
              <div key={index} className="mb-2">
                • {addon.room} {addon.size ? `(${addon.size})` : ""} - $
                {addon.price}
              </div>
            ))
          ) : (
            <div className="text-gray-600">No additional add-ons selected</div>
          )}
        </div>

        <PageFooter pageNumber={10} />
      </div>

      {/* PAGE 11 - Attachment B BILLING DETAILS & ALL USER INFO */}
      <div
        className="contract-page bg-white p-12 min-h-[297mm] flex flex-col"
        style={{ width: "210mm", fontSize: "12px", lineHeight: "1.5" }}
      >
        <LogoHeader pageNumber={11} />

        <h3 className="text-base font-bold mb-6">
          Attachment B BILLING DETAILS AND CUSTOMER INFORMATION
        </h3>

        {contractData?.billingDetails && (
          <div className="mb-6">
            <div className="font-bold mb-2">BILLING INFORMATION:</div>
            <div className="ml-4 space-y-1">
              <div>
                • First Name:{" "}
                {contractData.billingDetails.firstName || "Not provided"}
              </div>
              <div>
                • Last Name:{" "}
                {contractData.billingDetails.lastName || "Not provided"}
              </div>
              <div>
                • Email: {contractData.billingDetails.email || "Not provided"}
              </div>
              <div>
                • Phone: {contractData.billingDetails.phone || "Not provided"}
              </div>
              <div>
                • Country:{" "}
                {contractData.billingDetails.country || "Not provided"}
              </div>
              <div>
                • Address:{" "}
                {contractData.billingDetails.address || "Not provided"}
              </div>
              {contractData.billingDetails.notes && (
                <div>• Notes: {contractData.billingDetails.notes}</div>
              )}
            </div>
          </div>
        )}

        {/* ALL CUSTOMER INFORMATION */}
        {contractData?.userInfo?.length > 0 && (
          <div className="space-y-4">
            <div className="font-bold mb-2">
              CUSTOMER INFORMATION ({contractData.userInfo.length} Person
              {contractData.userInfo.length > 1 ? "s" : ""}):
            </div>

            {contractData.userInfo.map((user, index) => (
              <div
                key={index}
                className="mb-4 p-3 border border-gray-300 rounded"
              >
                <div className="font-semibold mb-2">Person {index + 1}:</div>
                <div className="ml-4 space-y-1">
                  <div>• Full Name: {user.name}</div>
                  <div>• Date of Birth: {user.dob}</div>
                  <div>• Email: {user.email}</div>
                  <div>• Phone: {user.phone}</div>
                  <div>• Address: {user.address}</div>
                  <div>• Country: {user.country}</div>
                  <div>• Passport/ID: {user.passportId}</div>
                </div>
              </div>
            ))}

            <div className="mb-4">
              <div className="font-bold mb-2">PACKAGE DETAILS:</div>
              <div className="ml-4 space-y-1">
                <div>
                  • Selected Package:{" "}
                  {contractData.basePackage?.title || "Standard Package"}
                </div>
                <div>
                  • Package Price: $
                  {contractData.basePackage?.price || contractData.totalAmount}
                </div>
                <div>• Total Investment: ${contractData.totalAmount}</div>
              </div>
            </div>

            {contractData.selectedAddOns &&
              contractData.selectedAddOns.length > 0 && (
                <div className="mb-4">
                  <div className="font-bold mb-2">SELECTED ADD-ONS:</div>
                  <div className="ml-4 space-y-1">
                    {contractData.selectedAddOns.map((addon, index) => (
                      <div key={index}>
                        • {addon.room} {addon.size ? `(${addon.size})` : ""} - $
                        {addon.price}
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        )}

        <PageFooter pageNumber={11} />
      </div>

      {/* PAGE 12 - ATTACHMENT C INHERITANCE WITH INLINE PASSPORT IMAGES */}
      <div
        className="contract-page bg-white p-12 min-h-[297mm] flex flex-col"
        style={{ width: "210mm", fontSize: "12px", lineHeight: "1.5" }}
      >
        <LogoHeader pageNumber={12} />

        <h3 className="text-base font-bold mb-6 text-red-600">
          ATTACHMENT C INHERITANCE (
          {contractData?.inheritanceContacts?.length || 0} Contact
          {(contractData?.inheritanceContacts?.length || 0) !== 1 ? "s" : ""})
        </h3>

        {contractData?.inheritanceContacts?.length > 0
          ? contractData.inheritanceContacts.map((contact, index) => (
              <div
                key={index}
                className="mb-8 p-4 border-2 border-red-200 rounded"
              >
                <div className="text-red-600 font-medium mb-2">
                  {index + 1}) Name: {contact.name}
                </div>
                <div className="mb-2">Phone Number: {contact.phoneNumber}</div>
                <div className="mb-2">
                  Passport ID: {contact.passportId || "Not provided"}
                </div>
                <div className="mb-4">
                  Percentage: {contact.percentage || "Not specified"}%
                </div>

                {/* PASSPORT IMAGE INLINE */}
                {contact.passportImage && (
                  <div className="mt-4">
                    <div className="font-medium text-red-600 mb-2">
                      Passport Image:
                    </div>
                    <div className="flex justify-center">
                      {contact.passportImage.startsWith(
                        "data:application/pdf"
                      ) ? (
                        <div className="w-64 h-40 bg-gray-100 flex items-center justify-center border-2 border-red-300 rounded">
                          <div className="text-center">
                            <div className="text-2xl mb-2">📄</div>
                            <span className="text-gray-600 text-sm">
                              PDF Document
                            </span>
                            <div className="text-xs text-gray-500 mt-1">
                              Passport - {contact.name}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <img
                          src={contact.passportImage}
                          alt={`Passport - ${contact.name}`}
                          className="max-w-64 max-h-40 object-contain border-2 border-red-300 rounded shadow-lg"
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          : Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="mb-6">
                <div className="text-red-600 font-medium mb-2">
                  {i + 1}) Name: ___________________________________
                </div>
                <div className="mb-2">
                  Phone Number: ______________________________
                </div>
                <div className="mb-2">
                  Passport ID: ______________________________
                </div>
                <div className="mb-2">
                  Percentage: ______________________________
                </div>
                <div className="mb-2">
                  Passport Image: ______________________________
                </div>
              </div>
            ))}

        <PageFooter pageNumber={12} />
      </div>

      {/* PAGE 13 - ATTACHMENT D EMERGENCY CONTACTS */}
      <div
        className="contract-page bg-white p-12 min-h-[297mm] flex flex-col"
        style={{ width: "210mm", fontSize: "12px", lineHeight: "1.5" }}
      >
        <LogoHeader pageNumber={13} />

        <h3 className="text-base font-bold mb-4 text-red-600">
          ATTACHMENT D NO CONTACT EMERGENCY (
          {contractData?.emergencyContacts?.length || 0} Contact
          {(contractData?.emergencyContacts?.length || 0) !== 1 ? "s" : ""})
        </h3>
        <div className="mb-2">If no contact with if 9-12 months we call</div>
        <div className="mb-4">the numbers bellow and embassy</div>

        {contractData?.emergencyContacts?.length > 0
          ? contractData.emergencyContacts.map((contact, index) => (
              <div
                key={index}
                className="mb-6 p-3 border border-red-200 rounded"
              >
                <div className="text-red-600 font-medium">
                  {index + 1}) Name: {contact.name}
                </div>
                <div className="ml-4">
                  • Phone Number: {contact.phoneNumber}
                </div>
                {contact.passportId && (
                  <div className="ml-4">
                    • Passport ID: {contact.passportId}
                  </div>
                )}
                {contact.idImage && (
                  <div className="ml-4 text-sm text-red-600">
                    ✓ ID image attached
                  </div>
                )}
              </div>
            ))
          : Array.from({ length: 2 }, (_, i) => (
              <div key={i} className="mb-4">
                <div className="text-red-600 font-medium">
                  {i + 1}) Name: ___________________________________
                </div>
                <div className="ml-4">
                  • Phone Number: ______________________________
                </div>
              </div>
            ))}

        <PageFooter pageNumber={13} />
      </div>

      {/* DYNAMIC PAGES FOR PASSPORT IMAGES - ALL USERS */}
      {contractData?.userInfo?.map((user, userIndex) => (
        <React.Fragment key={`user-${userIndex}`}>
          {/* PASSPORT/ID FRONT IMAGE */}
          <div
            className="contract-page bg-white p-12 min-h-[297mm] flex flex-col"
            style={{ width: "210mm", fontSize: "12px", lineHeight: "1.5" }}
          >
            <LogoHeader pageNumber={14 + userIndex * 2} />

            <h3 className="text-base font-bold mb-6 text-center">
              IDENTIFICATION DOCUMENTS - {user.name}
            </h3>
            <h4 className="text-base font-semibold mb-8 text-center">
              PASSPORT/ID - FRONT (Person {userIndex + 1})
            </h4>

            <div className="flex-1 flex items-center justify-center">
              {user.frontImage ? (
                <div className="w-full max-w-md">
                  {user.frontImage.startsWith("data:application/pdf") ? (
                    <div className="h-80 bg-gray-100 flex items-center justify-center border-2 border-gray-300 rounded">
                      <div className="text-center">
                        <div className="text-4xl mb-4">📄</div>
                        <span className="text-gray-600 text-lg">
                          PDF Document
                        </span>
                        <div className="text-sm text-gray-500 mt-2">
                          Front ID Document - {user.name}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <img
                        src={user.frontImage}
                        alt={`Front ID Document - ${user.name}`}
                        className="max-w-full max-h-80 mx-auto object-contain border-2 border-gray-300 rounded shadow-lg"
                      />
                      <div className="text-sm text-gray-600 mt-4">
                        Front ID Document - {user.name}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full max-w-md">
                  <div className="h-80 border-2 border-dashed border-gray-300 rounded flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                      <div className="text-gray-400 text-lg mb-2">
                        Front ID Document - {user.name}
                      </div>
                      <div className="text-gray-400 text-sm">
                        To be attached
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <PageFooter pageNumber={14 + userIndex * 2} />
          </div>

          {/* PASSPORT/ID BACK IMAGE */}
          <div
            className="contract-page bg-white p-12 min-h-[297mm] flex flex-col"
            style={{ width: "210mm", fontSize: "12px", lineHeight: "1.5" }}
          >
            <LogoHeader pageNumber={15 + userIndex * 2} />

            <h3 className="text-base font-bold mb-6 text-center">
              IDENTIFICATION DOCUMENTS - {user.name}
            </h3>
            <h4 className="text-base font-semibold mb-8 text-center">
              PASSPORT/ID - BACK (Person {userIndex + 1})
            </h4>

            <div className="flex-1 flex items-center justify-center">
              {user.backImage ? (
                <div className="w-full max-w-md">
                  {user.backImage.startsWith("data:application/pdf") ? (
                    <div className="h-80 bg-gray-100 flex items-center justify-center border-2 border-gray-300 rounded">
                      <div className="text-center">
                        <div className="text-4xl mb-4">📄</div>
                        <span className="text-gray-600 text-lg">
                          PDF Document
                        </span>
                        <div className="text-sm text-gray-500 mt-2">
                          Back ID Document - {user.name}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <img
                        src={user.backImage}
                        alt={`Back ID Document - ${user.name}`}
                        className="max-w-full max-h-80 mx-auto object-contain border-2 border-gray-300 rounded shadow-lg"
                      />
                      <div className="text-sm text-gray-600 mt-4">
                        Back ID Document - {user.name}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full max-w-md">
                  <div className="h-80 border-2 border-dashed border-gray-300 rounded flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                      <div className="text-gray-400 text-lg mb-2">
                        Back ID Document - {user.name}
                      </div>
                      <div className="text-gray-400 text-sm">
                        To be attached
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <PageFooter pageNumber={15 + userIndex * 2} />
          </div>
        </React.Fragment>
      ))}

      {/* DYNAMIC PAGES FOR EMERGENCY CONTACT ID IMAGES */}
      {contractData?.emergencyContacts?.map(
        (contact, contactIndex) =>
          contact.idImage && (
            <div
              key={`emergency-${contactIndex}`}
              className="contract-page bg-white p-12 min-h-[297mm] flex flex-col"
              style={{ width: "210mm", fontSize: "12px", lineHeight: "1.5" }}
            >
              <LogoHeader
                pageNumber={
                  16 + (contractData?.userInfo?.length || 0) * 2 + contactIndex
                }
              />

              <h3 className="text-base font-bold mb-6 text-center text-red-600">
                EMERGENCY CONTACT ID DOCUMENT
              </h3>
              <h4 className="text-base font-semibold mb-8 text-center">
                {contact.name} - ID Document
              </h4>

              <div className="flex-1 flex items-center justify-center">
                <div className="w-full max-w-md">
                  {contact.idImage.startsWith("data:application/pdf") ? (
                    <div className="h-80 bg-gray-100 flex items-center justify-center border-2 border-red-300 rounded">
                      <div className="text-center">
                        <div className="text-4xl mb-4">📄</div>
                        <span className="text-gray-600 text-lg">
                          PDF Document
                        </span>
                        <div className="text-sm text-gray-500 mt-2">
                          Emergency Contact ID - {contact.name}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <img
                        src={contact.idImage}
                        alt={`ID Document - ${contact.name}`}
                        className="max-w-full max-h-80 mx-auto object-contain border-2 border-red-300 rounded shadow-lg"
                      />
                      <div className="text-sm text-red-600 mt-4">
                        Emergency Contact ID - {contact.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        Phone: {contact.phoneNumber}
                        {contact.passportId &&
                          ` | Passport: ${contact.passportId}`}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <PageFooter
                pageNumber={
                  16 + (contractData?.userInfo?.length || 0) * 2 + contactIndex
                }
              />
            </div>
          )
      )}

      {/* FINAL PAGE: Signatures */}
      <div
        className="contract-page bg-white p-12 min-h-[297mm] flex flex-col"
        style={{ width: "210mm", fontSize: "12px", lineHeight: "1.5" }}
      >
        <LogoHeader
          pageNumber={
            17 +
            (contractData?.userInfo?.length || 0) * 2 +
            (contractData?.emergencyContacts?.filter((c) => c.idImage).length ||
              0)
          }
        />

        <div className="mt-8 mb-4">
          This agreement is made in 2 (two) copies, sufficiently stamped, and
          having the same legal force, signed by both parties.
        </div>

        <div className="flex justify-between mt-8">
          <div>
            <div className="font-bold">FIRST PARTY</div>
            {contractData?.userInfo?.length > 0 && (
              <div className="text-xs mt-2">
                {contractData.userInfo.map((user, index) => (
                  <div key={index} className="mb-2">
                    {user.name}
                    <div className="mt-8 mb-4 border-b border-gray-400 w-48"></div>
                    <div className="text-xs">Signature {index + 1}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <div className="font-bold">SECOND PARTY</div>
            <div className="mt-4 flex items-center">
              <img
                src={logo}
                alt="Future Life PT Logo"
                className="w-8 h-8 mr-2"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
              <div
                className="w-8 h-8 bg-yellow-400 rounded flex items-center justify-center mr-2"
                style={{ display: "none" }}
              >
                <span className="text-white font-bold text-xs">FL</span>
              </div>
              <span>Future Life (PT)</span>
            </div>
            <div className="mt-8 border-b border-gray-400 w-48"></div>
            <div className="mt-2">DIRECTOR</div>
          </div>
        </div>

        <PageFooter
          pageNumber={
            17 +
            (contractData?.userInfo?.length || 0) * 2 +
            (contractData?.emergencyContacts?.filter((c) => c.idImage).length ||
              0)
          }
        />
      </div>
    </div>
  );
});

export default ContractPDFGenerator;
