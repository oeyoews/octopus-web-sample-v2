/**
 * 船只作战运动轨迹数据生成器
 * 模拟真实船只的作战运动轨迹，生成符合指定格式的数据
 */

import fs from 'fs';

class ShipTrajectoryGenerator {
	constructor() {
		// 初始位置参数（模拟某个海域的起始点）
		this.initialLatitude = 28.1639999999996;  // 初始纬度
		this.initialLongitude = 130.1540000000050; // 初始经度
		this.initialDepth = 50; // 初始深度（米）

		// 运动参数
		this.speed = 15; // 平均速度（节）
		this.maxSpeedVariation = 15; // 速度变化范围（大幅增加）
		this.maxHeadingChange = 90; // 最大航向变化（度，大幅增加）
		this.depthVariation = 50; // 深度变化范围（米，大幅增加）

		// 时间参数
		this.startTime = new Date('2025-10-10T11:03:14.400Z');
		this.timeInterval = 30; // 数据点间隔（秒）
		this.totalDuration = 3600; // 总时长（秒，1小时）

		// 批号
		this.batchNumber = 1010;

		// 作战阶段参数
		this.preferredDirection = 60; // 目标方向（度，东北方向）
		this.normalPhaseRatio = 0.3; // 正常航行阶段占比（30%）
		this.combatPhaseRatio = 0.5; // 遇敌机动阶段占比（50%）
		this.approachPhaseRatio = 0.2; // 接近目标阶段占比（20%）

		// 各阶段参数
		this.normalStability = 0.9; // 正常阶段稳定性
		this.combatIntensity = 0.8; // 作战阶段机动强度
		this.approachStability = 0.7; // 接近阶段稳定性
	}

	/**
	 * 生成时间戳（格式：YYYYMMDDHHMMSSmmm）
	 */
	generateTimestamp(baseTime, offsetSeconds) {
		const time = new Date(baseTime.getTime() + offsetSeconds * 1000);
		const year = time.getFullYear();
		const month = String(time.getMonth() + 1).padStart(2, '0');
		const day = String(time.getDate()).padStart(2, '0');
		const hour = String(time.getHours()).padStart(2, '0');
		const minute = String(time.getMinutes()).padStart(2, '0');
		const second = String(time.getSeconds()).padStart(2, '0');
		const millisecond = String(time.getMilliseconds()).padStart(3, '0');

		return `${year}${month}${day}${hour}${minute}${second}${millisecond}`;
	}

	/**
	 * 获取当前作战阶段
	 */
	getCombatPhase(timeIndex, totalPoints) {
		const phase = timeIndex / (totalPoints - 1);

		if (phase < this.normalPhaseRatio) {
			return 'normal'; // 正常航行阶段
		} else if (phase < this.normalPhaseRatio + this.combatPhaseRatio) {
			return 'combat'; // 遇敌机动阶段
		} else {
			return 'approach'; // 接近目标阶段
		}
	}

	/**
	 * 计算下一个位置点
	 */
	calculateNextPosition(currentLat, currentLon, currentHeading, speed, timeInterval) {
		// 将速度从节转换为米/秒
		const speedMs = speed * 0.514444;

		// 计算距离（米）
		const distance = speedMs * timeInterval;

		// 将距离转换为经纬度变化
		const earthRadius = 6371000; // 地球半径（米）
		const latChange = (distance / earthRadius) * (180 / Math.PI);
		const lonChange = (distance / earthRadius) * (180 / Math.PI) / Math.cos(currentLat * Math.PI / 180);

		// 根据航向计算新的经纬度
		const headingRad = currentHeading * Math.PI / 180;
		const newLat = currentLat + latChange * Math.cos(headingRad);
		const newLon = currentLon + lonChange * Math.sin(headingRad);

		return {
			latitude: newLat,
			longitude: newLon
		};
	}

	/**
	 * 生成航向变化（根据作战阶段生成不同机动模式）
	 */
	generateHeadingChange(currentHeading, timeIndex, totalPoints) {
		const combatPhase = this.getCombatPhase(timeIndex, totalPoints);

		// 计算与目标方向的偏差
		let directionDiff = this.preferredDirection - currentHeading;
		if (directionDiff > 180) directionDiff -= 360;
		if (directionDiff < -180) directionDiff += 360;

		let newHeading = currentHeading;

		switch (combatPhase) {
			case 'normal':
				// 正常航行阶段：保持稳定，小幅调整航向
				const normalAdjustment = directionDiff * 0.3; // 缓慢向目标方向调整
				const normalRandom = (Math.random() - 0.5) * 5; // 小幅随机扰动
				newHeading += normalAdjustment + normalRandom;
				break;

			case 'combat':
				// 遇敌机动阶段：大幅左右波动，模拟规避机动
				const combatAdjustment = directionDiff * 0.1; // 减少向目标方向的调整

				// 左右规避机动（蛇形机动）
				const evasivePattern = Math.sin(timeIndex * 0.3) * 60 * this.combatIntensity;

				// 随机急转弯
				let evasiveTurn = 0;
				if (Math.random() < 0.4) { // 40%概率急转弯
					const turnDirection = Math.random() < 0.5 ? 1 : -1;
					evasiveTurn = turnDirection * (45 + Math.random() * 45); // 45-90度急转弯
				}

				// 随机波动
				const combatRandom = (Math.random() - 0.5) * 40 * this.combatIntensity;

				newHeading += combatAdjustment + evasivePattern + evasiveTurn + combatRandom;
				break;

			case 'approach':
				// 接近目标阶段：逐渐稳定，向目标方向靠拢
				const approachAdjustment = directionDiff * 0.6; // 较强地向目标方向调整
				const approachRandom = (Math.random() - 0.5) * 15; // 中等随机扰动

				// 小幅规避机动
				const approachEvasive = Math.sin(timeIndex * 0.1) * 20 * this.approachStability;

				newHeading += approachAdjustment + approachRandom + approachEvasive;
				break;
		}

		// 确保航向在0-360度范围内
		newHeading = ((newHeading % 360) + 360) % 360;

		return newHeading;
	}

	/**
	 * 生成深度变化（根据作战阶段调整深度机动）
	 */
	generateDepthChange(currentDepth, timeIndex, totalPoints) {
		const combatPhase = this.getCombatPhase(timeIndex, totalPoints);

		let newDepth = currentDepth;

		switch (combatPhase) {
			case 'normal':
				// 正常航行阶段：保持相对稳定的深度
				const normalDepthChange = (Math.random() - 0.5) * 5; // 小幅深度变化
				const normalDepthWave = Math.sin(timeIndex * 0.05) * 3; // 小幅周期性变化
				newDepth += normalDepthChange + normalDepthWave;
				break;

			case 'combat':
				// 遇敌机动阶段：大幅深度变化，模拟潜航规避
				const combatDepthChange = (Math.random() - 0.5) * 30; // 大幅深度变化

				// 快速深度机动（模拟紧急下潜/上浮）
				const combatDepthWave = Math.sin(timeIndex * 0.2) * 25 * this.combatIntensity;

				// 随机大幅深度变化
				let combatLargeChange = 0;
				if (Math.random() < 0.3) { // 30%概率大幅变化
					const changeDirection = Math.random() < 0.5 ? 1 : -1;
					combatLargeChange = changeDirection * (15 + Math.random() * 35); // 15-50米变化
				}

				// 紧急深度机动
				let emergencyChange = 0;
				if (Math.random() < 0.15) { // 15%概率紧急机动
					const changeDirection = Math.random() < 0.5 ? 1 : -1;
					emergencyChange = changeDirection * (30 + Math.random() * 40); // 30-70米紧急变化
				}

				newDepth += combatDepthChange + combatDepthWave + combatLargeChange + emergencyChange;
				break;

			case 'approach':
				// 接近目标阶段：逐渐稳定深度
				const approachDepthChange = (Math.random() - 0.5) * 15; // 中等深度变化
				const approachDepthWave = Math.sin(timeIndex * 0.1) * 10 * this.approachStability;

				// 小幅规避深度变化
				let approachEvasive = 0;
				if (Math.random() < 0.2) { // 20%概率小幅规避
					const changeDirection = Math.random() < 0.5 ? 1 : -1;
					approachEvasive = changeDirection * (5 + Math.random() * 15); // 5-20米变化
				}

				newDepth += approachDepthChange + approachDepthWave + approachEvasive;
				break;
		}

		// 确保深度在合理范围内（10-200米）
		newDepth = Math.max(10, Math.min(200, newDepth));

		return Math.round(newDepth);
	}

	/**
	 * 生成速度变化（根据作战阶段调整速度机动）
	 */
	generateSpeedChange(timeIndex, totalPoints) {
		const combatPhase = this.getCombatPhase(timeIndex, totalPoints);
		const baseSpeed = this.speed;

		let newSpeed = baseSpeed;

		switch (combatPhase) {
			case 'normal':
				// 正常航行阶段：保持稳定速度
				const normalSpeedVariation = (Math.random() - 0.5) * 3; // 小幅速度变化
				const normalSpeedWave = Math.sin(timeIndex * 0.05) * 2; // 小幅周期性变化
				newSpeed += normalSpeedVariation + normalSpeedWave;
				break;

			case 'combat':
				// 遇敌机动阶段：大幅速度变化，模拟战术机动
				const combatSpeedVariation = (Math.random() - 0.5) * 12; // 大幅速度变化

				// 快速速度机动（模拟加速/减速规避）
				const combatSpeedWave = Math.sin(timeIndex * 0.15) * 8 * this.combatIntensity;

				// 随机大幅速度变化
				let combatLargeChange = 0;
				if (Math.random() < 0.3) { // 30%概率大幅变化
					const changeDirection = Math.random() < 0.5 ? 1 : -1;
					combatLargeChange = changeDirection * (5 + Math.random() * 10); // 5-15节变化
				}

				// 紧急速度机动
				let emergencySpeedChange = 0;
				if (Math.random() < 0.2) { // 20%概率紧急机动
					const changeDirection = Math.random() < 0.5 ? 1 : -1;
					emergencySpeedChange = changeDirection * (8 + Math.random() * 12); // 8-20节紧急变化
				}

				newSpeed += combatSpeedVariation + combatSpeedWave + combatLargeChange + emergencySpeedChange;
				break;

			case 'approach':
				// 接近目标阶段：逐渐稳定速度
				const approachSpeedVariation = (Math.random() - 0.5) * 6; // 中等速度变化
				const approachSpeedWave = Math.sin(timeIndex * 0.1) * 4 * this.approachStability;

				// 小幅战术速度调整
				let approachTactical = 0;
				if (Math.random() < 0.25) { // 25%概率战术调整
					const changeDirection = Math.random() < 0.5 ? 1 : -1;
					approachTactical = changeDirection * (2 + Math.random() * 6); // 2-8节调整
				}

				newSpeed += approachSpeedVariation + approachSpeedWave + approachTactical;
				break;
		}

		return Math.max(5, Math.min(30, newSpeed)); // 合理速度范围
	}

	/**
	 * 生成单条轨迹数据
	 */
	generateTrajectoryData() {
		const trajectory = [];
		let currentLat = this.initialLatitude;
		let currentLon = this.initialLongitude;
		let currentDepth = this.initialDepth;
		let currentHeading = 45; // 初始航向（东北方向）
		let currentSpeed = this.speed;

		const totalPoints = Math.floor(this.totalDuration / this.timeInterval);

		for (let i = 0; i < totalPoints; i++) {
			const offsetSeconds = i * this.timeInterval;
			const timestamp = this.generateTimestamp(this.startTime, offsetSeconds);

			// 生成位置数据
			const position = this.calculateNextPosition(
				currentLat,
				currentLon,
				currentHeading,
				currentSpeed,
				this.timeInterval
			);

			// 更新当前位置
			currentLat = position.latitude;
			currentLon = position.longitude;

			// 生成其他参数（传递totalPoints用于阶段控制）
			currentHeading = this.generateHeadingChange(currentHeading, i, totalPoints);
			currentDepth = this.generateDepthChange(currentDepth, i, totalPoints);
			currentSpeed = this.generateSpeedChange(i, totalPoints);

			// 格式化数据（保持高精度）
			const dataPoint = {
				timestamp: timestamp,
				batchNumber: this.batchNumber,
				longitude: parseFloat(currentLon.toFixed(13)),
				latitude: parseFloat(currentLat.toFixed(13)),
				depth: currentDepth,
				heading: Math.round(currentHeading)
			};

			trajectory.push(dataPoint);
		}

		return trajectory;
	}

	/**
	 * 将数据保存到txt文件
	 */
	saveToFile(trajectory, filename = 'ship_trajectory_data.txt') {
		const header = '时戳\t批号\t经度\t维度\t深度\t航向\n';
		const dataLines = trajectory.map(point =>
			`${point.timestamp}\t${point.batchNumber}\t${point.longitude}\t${point.latitude}\t${point.depth}\t${point.heading}`
		);

		const content = header + dataLines.join('\n');

		fs.writeFileSync(filename, content, 'utf8');
		console.log(`轨迹数据已保存到: ${filename}`);
		console.log(`共生成 ${trajectory.length} 个数据点`);
	}




	/**
	 * 生成并保存轨迹数据
	 */
	generateAndSave() {
		console.log('开始生成船只作战运动轨迹数据...');
		console.log(`起始位置: 纬度 ${this.initialLatitude}, 经度 ${this.initialLongitude}`);
		console.log(`运动参数: 平均速度 ${this.speed} 节, 数据间隔 ${this.timeInterval} 秒`);
		console.log(`作战阶段: 正常航行(${this.normalPhaseRatio * 100}%) -> 遇敌机动(${this.combatPhaseRatio * 100}%) -> 接近目标(${this.approachPhaseRatio * 100}%)`);

		const trajectory = this.generateTrajectoryData();

		// 保存完整轨迹
		this.saveToFile(trajectory, 'ship_trajectory_data.txt');

		// 显示一些统计信息
		const firstPoint = trajectory[0];
		const lastPoint = trajectory[trajectory.length - 1];

		console.log('\n=== 轨迹统计信息 ===');
		console.log(`起始时间: ${firstPoint.timestamp}`);
		console.log(`结束时间: ${lastPoint.timestamp}`);
		console.log(`起始位置: (${firstPoint.latitude}, ${firstPoint.longitude})`);
		console.log(`结束位置: (${lastPoint.latitude}, ${lastPoint.longitude})`);
		console.log(`深度范围: ${Math.min(...trajectory.map(p => p.depth))} - ${Math.max(...trajectory.map(p => p.depth))} 米`);
		console.log(`航向范围: ${Math.min(...trajectory.map(p => p.heading))} - ${Math.max(...trajectory.map(p => p.heading))} 度`);
		console.log(`总数据点: ${trajectory.length}`);

		return trajectory;
	}
}

const generator = new ShipTrajectoryGenerator();
generator.generateAndSave();

