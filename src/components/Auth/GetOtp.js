const GetOtp = ({ mobile_number, set_mobile_number, generate_otp }) => {
        return (
                <div className="card-body">
			<h5 className="card-title">Enter your registered Phone Number to receive OTP</h5>
			<p className="card-text">
				<input type="text" value={mobile_number} onChange={e => set_mobile_number(e.target.value)} />
			</p>
			<button className="btn btn-primary" disabled={mobile_number.length !== 10} onClick={generate_otp}>Submit</button>
		</div>
        );
}

export default GetOtp;