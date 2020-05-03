import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Logo } from 'components/Logo';
import { LoadingSpinner } from 'components/LoadingSpinner';
import { isAndroid, isIOS } from 'react-device-detect';

const Wrapper = styled.div`
	padding: 1rem;
`;

const LogoWrap = styled.div`
	transform: scale(0.4);
	display: flex;
	justify-content: space-around;
	margin-top: -50px;
`;

const Subtext = styled.p`
	margin-top: -10px;
	font-family: Nunito;
	font-style: normal;
	font-weight: normal;
	font-size: 16px;
	text-align: center;
	color: #7b6908;
`;

const Button = styled.button`
	background: #5738ff;
	border: 3px solid rgba(240, 246, 249, 0.7);
	box-sizing: border-box;
	box-shadow: 4px 9px 20px rgba(176, 195, 210, 0.2);
	border-radius: 71px;
	font-family: Nunito;
	font-style: normal;
	font-weight: 500;
	font-size: 18px;
	text-align: center;
	color: #ffffff;
	width: 100%;
	padding: 20px;
	margin-bottom: 20px;
`;

class Friend extends React.Component {
	state = {
		ip: null,
		error: null,
		loading: true,
	};

	prepData = () => {
		const {
			match: {
				params: { token },
			},
		} = this.props;
		if (!token) {
			return this.setState({ error: 'This link seems to be expired' });
		}
		return Promise.all([
			fetch('https://api.ipify.org', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			}),
			fetch(`https://api.dontpester.com/getname/${token}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			}),
		])
			.then(([res1, res2]) => Promise.all([res1.text(), res2.json()]))
			.then(([resp1, resp2]) => {
				if (resp2.name) {
					return this.setState({
						ip: resp1,
						name: resp2.name,
						loading: false,
					});
				}
				return this.setState({ error: resp2.error, loading: false });
			});
	};

	openDeepLink = () => {
		const {
			match: {
				params: { token },
			},
		} = this.props;
		return window.location.replace(`dontpester://friend/${token}`);
	};

	handleDownload = platform => {
		const {
			match: {
				params: { token },
			},
		} = this.props;
		const { ip } = this.state;
		fetch('https://api.dontpester.com/prepare', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				addFriend: token,
				ip,
			}),
		}).catch(() => null);
		if (platform === 'ios') {
			return window.location.replace('APPSTORE LINK HERE');
		}
		return window.location.replace('PLAYSTORE LINK HERE');
	};

	componentDidMount() {
		this.prepData();
	}

	render() {
		const { error, name, loading } = this.state;
		return (
			<div className="container">
				<div className="row">
					<div className="col-12">
						<LogoWrap>
							<Logo />
						</LogoWrap>
					</div>
				</div>
				<div className="row">
					<div className="col-12">
						<Wrapper>
							{loading && <LoadingSpinner />}
							{error && !loading && (
								<p className="text-danger text-center">
									{error}
								</p>
							)}
							{!error && !loading && (
								<>
									<div className="mb-5">
										<Subtext>
											{name} wants to add you as a person
											as pester
										</Subtext>
										<Subtext>
											Have you you downloaded DontPester
											App yet?
										</Subtext>
									</div>
									<Button onClick={this.openDeepLink}>
										Yes
									</Button>
									{isIOS && (
										<Button
											onClick={() =>
												this.handleDownload('ios')
											}
										>
											No
										</Button>
									)}
									{isAndroid && (
										<Button
											onClick={() =>
												this.handleDownload('android')
											}
										>
											No
										</Button>
									)}
								</>
							)}
						</Wrapper>
					</div>
				</div>
			</div>
		);
	}
}

Friend.propTypes = {
	match: PropTypes.object,
};

export default Friend;
