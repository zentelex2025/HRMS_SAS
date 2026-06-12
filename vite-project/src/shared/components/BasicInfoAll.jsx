export const AddressInfo = ({ classAddress }) => {
  return (
    <section className={classAddress}>
      <div>
        <h2>Address</h2>

        <div>
          <label>Address</label>
          <input type="text" />
        </div>

        <div>
          <label>City</label>
          <input type="text" />
        </div>

        <div>
          <label>State</label>
          <input type="text" />
        </div>

        <div>
          <label>Pincode</label>
          <input type="text" />
        </div>
      </div>
    </section>
  );
};
export const IdentificationInfo = ({ classIdentification }) => {
  return (
    <section className={classIdentification}>
      <div>
        <h2>Identification</h2>

        <div>
          <label>PAN</label>
          <input type="text" />
        </div>

        <div>
          <label>Aadhaar</label>
          <input type="text" />
        </div>

        <div>
          <label>Blood Group</label>
          <input type="text" />
        </div>
      </div>
    </section>
  );
};

export const BankDetails = ({ classBank }) => {
  return (
    <section className={classBank}>
      <div>
        <h2>Bank Details</h2>

        <div>
          <label>Bank Name</label>
          <input type="text" />
        </div>

        <div>
          <label>Branch</label>
          <input type="text" />
        </div>

        <div>
          <label>Account No</label>
          <input type="text" />
        </div>

        <div>
          <label>IFSC Code</label>
          <input type="text" />
        </div>
      </div>
    </section>
  );
};
