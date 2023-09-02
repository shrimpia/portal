export const generateToken = () => {
	const buf = new Uint32Array(3);
	crypto.getRandomValues(buf);
	const randomValue = Array.from(buf).map(n => n.toString(36)).join('');

	const date = new Date();
	const time = [
		date.getHours().toString(36),
		date.getMinutes().toString(36),
		date.getSeconds().toString(36),
		date.getMilliseconds().toString(36),
	].join('');

	return `${randomValue}${time}`;
}
