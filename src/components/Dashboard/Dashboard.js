import { useState } from 'react';
import  Message from '../message/Message';
import { GENERATE_OTP_API_ENDPOINT, VALIDATE_OTP_API_ENDPOINT, DOWNLOAD_CERTIFICATE_API_ENDPOINT } from '../../consts';
import crypto from 'crypto';

const Auth = () => {
	const [otp, set_otp] = useState(""); 
	const [mobile_number, set_mobile_number] = useState("");
	const [txn_id, set_txn_id] = useState("");
	const [msg, set_msg] = useState("");
	const [otp_sent, set_otp_sent] = useState(false);
	const [otp_verified, set_otp_verified] = useState(false);
	const [token ,set_token] = useState("");
	const [beneficiary_id, set_beneficiary_id] = useState("");
	const [loading_button_text, set_loading_button_text] = useState(false);

	const logout = () => {
				set_otp_sent(false);
				set_otp_verified(false);
				set_otp("");
				set_beneficiary_id("");
				set_token("");
				set_txn_id("");
				set_mobile_number("");
				set_msg("");
	}

	const generate_otp = async () => {
		try {
			const resp = await fetch(GENERATE_OTP_API_ENDPOINT, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({"mobile":mobile_number})
			});
	
			const data = await resp.json();
			console.log(data);
			set_txn_id(data.txnId);
			set_otp_sent(!otp_sent);
			

		} catch(e) {
			console.log(e);
			set_msg("There was an error. Either the mobile number which has been used to receive OTP is not correct or the number has recently been used to receive OTP. Please try again after sometime");
		}		
	}


	const verify_otp = async () => {
		const encoded_otp = crypto.createHash('sha256').update(otp).digest('hex');

		try {
			const resp = await fetch(VALIDATE_OTP_API_ENDPOINT, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					"otp":encoded_otp,
					"txnId": txn_id
				})
			});

			const data = await resp.json();

			if (resp.status === 200) {
				console.log(data);
				set_token(data.token);
				set_otp_verified(true);

			} else if (resp.status === 400) {
				set_msg(data.error);
			} else {
				set_msg("There was an error, Please try again later");
			}		


		} catch(e) {
			console.log(e);
			
		}
	}

	const download_certificate = async () => {
		set_loading_button_text(true);
		try {
			const resp = await fetch(`${DOWNLOAD_CERTIFICATE_API_ENDPOINT}${beneficiary_id}`, {
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${token}`
				}
			});

			if (resp.status === 200) {
				const file = await resp.blob();
				console.log(file)
				const url = window.URL.createObjectURL(file);
				const a = document.createElement('a');
				a.href = url;
				a.download = 'certificate.pdf';
				document.body.appendChild(a);
				a.click();
				a.remove();
				logout();

				
				
			} else if (resp.status === 400) {
				const error = await resp.json();
				set_msg(error.error);
				console.log(error)
				
			} else {
				set_msg("There was an error, Please try again later");
			}

			


		} catch(e) {
			console.log(e);
		}

		set_loading_button_text(false);
	}
	return (
		<div id="auth">
			
			<div className="card text-center">
				<div className="card-header">
				<ul className="nav nav-tabs card-header-tabs">
				<li className="nav-item">
					<a className={`nav-link ${!otp_sent ? "active" : "disabled"}`} aria-current="true" href="#!">Enter Phone Number</a>
				</li>
				<li className="nav-item">
					<a className={`nav-link ${ otp_sent ? "active" : "disabled"}`} href="#!" tabindex="-1" aria-disabled="true"
					>Verify OTP and Download</a>
				</li>
				<li className="nav-item">
					<a className="nav-link" tabindex="-1" aria-disabled="true" href="#!" onClick={logout}
					>Logout</a>
				</li>
				</ul>
				</div>
				{ !otp_sent ? 
					<div className="card-body">
						<h5 className="card-title">Enter your registered Phone Number to receive OTP</h5>
						<p className="card-text">
							<input type="text" value={mobile_number} onChange={e => set_mobile_number(e.target.value)} />
						</p>
						<button className="btn btn-primary" disabled={mobile_number.length !== 10} onClick={generate_otp}>Submit</button>
					</div>

					:

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
				}
				
				</div>

			{msg && <Message msg={msg} />}
							
		</div>
		
	);

}

export default Auth;