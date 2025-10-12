// Validate IP and Port
export const validateIpPort = (input: string): { isValid: boolean; error: string } => {
	if (!input.trim()) {
		return { isValid: false, error: '请输入IP地址和端口' }
	}

	// Check if input contains protocol
	let cleanInput = input.trim()
	if (cleanInput.startsWith('http://')) {
		cleanInput = cleanInput.replace('http://', '')
	} else if (cleanInput.startsWith('https://')) {
		cleanInput = cleanInput.replace('https://', '')
	}

	// Split by colon to get IP and port
	const parts = cleanInput.split(':')
	if (parts.length !== 2) {
		return { isValid: false, error: '格式应为 IP:PORT (例如: 192.168.1.1:8080)' }
	}

	const [ip, port] = parts

	// Validate IP address
	const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
	if (!ip || !ipRegex.test(ip)) {
		return { isValid: false, error: 'IP地址格式无效' }
	}

	// Validate port
	if (!port) {
		return { isValid: false, error: '端口号不能为空' }
	}
	const portNum = parseInt(port, 10)
	if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
		return { isValid: false, error: '端口号必须在1-65535之间' }
	}

	return { isValid: true, error: '' }
}