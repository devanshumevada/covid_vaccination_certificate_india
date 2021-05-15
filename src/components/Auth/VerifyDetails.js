const VerifyDetails = ({ otp, otp_verified, set_otp, verify_otp, beneficiary_id, set_beneficiary_id, download_certificate, loading_button_text }) => {
        return (
                <div className="card-body">
			{!otp_verified ? <> 
				<h5 className="card-title">Enter OTP</h5>
					<p className="card-text">
						<input value={otp} type="text" onChange={e => set_otp(e.target.value)} />
					</p>
								<button className="btn btn-primary" disabled={otp.length !== 6} onClick={verify_otp}>Verify OTP</button>
					</> : 
							
					<> 
						<h5 className="card-title">Enter Beneficiary Id</h5>
						<p className="card-text">
								<input type="text" value={beneficiary_id} onChange={e => set_beneficiary_id(e.target.value)} />
							</p>
						<button className="btn btn-primary" disabled={!beneficiary_id} onClick={download_certificate}>{`${loading_button_text ? "Downloading...." : "Verify and Download"}`}</button>
					</>
			}
						
		</div>
        );

}

export default VerifyDetails;