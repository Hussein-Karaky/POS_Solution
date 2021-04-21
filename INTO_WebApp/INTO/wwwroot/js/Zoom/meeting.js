const meetConfigHst = {
	apiKey: "gChSzqMZQLav35uSAH0Yvg",
	meetingNumber: "",//'77722030286',
	leaveUrl: 'https://yoursite.com/meetingEnd',
	userName: "Hussein Karaky",
	userEmail: "karakyhussein@outlook.com",
	passWord: "VXVQN0xFOU5DNnYyTEJuSTBpeXV2UT09", // if required
	role: 1, // 1 for host; 0 for attendee // 5 for host assistant
	token: "https://localhost:5001/meeting/tokenHst"
};
const meetConfigAtt = {
	apiKey: "gChSzqMZQLav35uSAH0Yvg",
	meetingNumber: '77722030286',
	leaveUrl: 'https://yoursite.com/meetingEnd',
	userName: "Hussein Karaky",
	userEmail: "karakyhussein@gmail.com",
	passWord: "VXVQN0xFOU5DNnYyTEJuSTBpeXV2UT09", // if required
	role: 0, // 1 for host; 0 for attendee // 5 for host assistant
	token: "https://localhost:5001/meeting/token"
};
getSignature = function (meetConfig) {
	fetch(meetConfig.token, {
		method: 'POST',
		body: JSON.stringify({ meetingData: meetConfig })
	})
		.then(result => result.text())
		.then(response => {
			ZoomMtg.init({
				leaveUrl: meetConfig.leaveUrl,
				isSupportAV: true,
				success: function () {
					ZoomMtg.join({
						signature: response,
						apiKey: meetConfig.apiKey,
						meetingNumber: meetConfig.meetingNumber,
						userName: meetConfig.userName,
						// password optional; set by Host
						passWord: meetConfig.passWord,
						success: (success) => {
							console.log(success)
						},
						error: (error) => {
							console.log(error)
						}
					})
				}
			});
		});
};
$(document).ready(function () {
	let btnStart = document.querySelector('[data-role=start-meeting]');
	if (btnStart !== null && btnStart !== undefined) {
		btnStart.addEventListener("click", function () {
			getSignature(meetConfigHst);
		});
	}
	let btnJoin = document.querySelector('[data-role=join-meeting]');
	if (btnJoin !== null && btnJoin !== undefined) {
		btnJoin.addEventListener("click", function () {
			getSignature(meetConfigAtt);
		});
	}
});