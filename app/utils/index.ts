// Validate WebSocket IP and Port
export const validateIpPort = (input: string): { isValid: boolean; error: string } => {
	if (!input.trim()) {
		return { isValid: false, error: '请输入WebSocket服务器地址和端口' }
	}

	const cleanInput = input.trim()

	// 检查是否以http://开头
	if (!cleanInput.startsWith('http://')) {
		return { isValid: false, error: '请输入http://IP:PORT格式 (例如: http://192.168.1.1:8080)' }
	}

	// 移除http://前缀
	const withoutProtocol = cleanInput.replace('http://', '')

	// Split by colon to get IP and port
	const parts = withoutProtocol.split(':')
	if (parts.length !== 2) {
		return { isValid: false, error: '格式应为 http://IP:PORT (例如: http://192.168.1.1:8080)' }
	}

	const [ip, port] = parts

	// Validate IP address - 支持局域网IP和公网IP
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