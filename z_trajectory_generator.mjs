/**
 * Z型轨迹数据生成器
 * 生成具有明显Z字形特征的轨迹数据
 * 模拟Z型机动模式，具有尖锐的Z字形转向
 */

import fs from 'fs';

class ZTrajectoryGenerator {
	constructor() {
		// 初始位置参数
		this.initialLatitude = 28.1639999999996;
		this.initialLongitude = 130.1540000000050;
		this.initialDepth = 50;

		// Z型轨迹参数
		this.baseSpeed = 18; // 基础速度（节）
		this.zAmplitude = 0.8; // Z型幅度（相对于基础距离的比例）
		this.zWavelength = 12; // Z型波长（数据点数）
		this.zAngle = 45; // Z型角度（度）
		this.zSharpAngle = 135; // Z型尖锐角度（度）

		// 时间参数
		this.startTime = new Date('2025-10-10T11:03:14.400Z');
		this.timeInterval = 30; // 数据点间隔（秒）
		this.totalDuration = 3600; // 总时长（秒，1小时）

		// 批号
		this.batchNumber = 1050;

		// Z型轨迹方向参数
		this.mainDirection = 60; // 主方向（度，东北方向）
		this.zPatternDirection = 0; // Z型模式方向（度，正北方向）

		// 随机性参数
		this.randomnessLevel = 0.2; // 随机性级别（0-1）
		this.zVariation = 0.3; // Z型变化范围（±30%）
		this.randomTurnProbability = 0.1; // 随机转向概率（10%）
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
	 * 生成Z型航向
	 */
	generateZHeading(timeIndex, totalPoints) {
		// 计算Z型相位
		const phase = (timeIndex / this.zWavelength) * 2 * Math.PI;

		// 生成Z型航向变化（使用锯齿波函数）
		const zHeading = this.generateZigzagWave(phase) * this.zAngle;

		// 基础航向（主方向）
		const baseHeading = this.mainDirection;

		// 随机转向
		let randomTurn = 0;
		if (Math.random() < this.randomTurnProbability) {
			const turnDirection = Math.random() < 0.5 ? 1 : -1;
			randomTurn = turnDirection * (Math.random() * 30); // 0-30度随机转向
		}

		// 随机性变化
		const randomVariation = (Math.random() - 0.5) * 10 * this.randomnessLevel;

		// 计算最终航向
		const finalHeading = baseHeading + zHeading + randomTurn + randomVariation;

		// 确保航向在0-360度范围内
		return ((finalHeading % 360) + 360) % 360;
	}

	/**
	 * 生成锯齿波函数（用于Z型模式）
	 */
	generateZigzagWave(phase) {
		// 使用锯齿波函数生成Z型模式
		const normalizedPhase = (phase % (2 * Math.PI)) / (2 * Math.PI);

		if (normalizedPhase < 0.25) {
			// 第一段：正向
			return 1;
		} else if (normalizedPhase < 0.5) {
			// 第二段：负向
			return -1;
		} else if (normalizedPhase < 0.75) {
			// 第三段：正向
			return 1;
		} else {
			// 第四段：负向
			return -1;
		}
	}

	/**
	 * 生成Z型深度变化
	 */
	generateZDepth(timeIndex, totalPoints) {
		// 计算Z型相位
		const phase = (timeIndex / this.zWavelength) * 2 * Math.PI;

		// 生成与航向同步的深度变化
		const depthWave = this.generateZigzagWave(phase) * 20; // 深度波动幅度

		// 基础深度
		const baseDepth = this.initialDepth;

		// 随机深度变化
		const randomChange = (Math.random() - 0.5) * 10 * (1 + this.randomnessLevel);

		// 随机深度跳跃
		let depthJump = 0;
		if (Math.random() < 0.05) { // 5%概率深度跳跃
			const jumpDirection = Math.random() < 0.5 ? 1 : -1;
			depthJump = jumpDirection * (5 + Math.random() * 15); // 5-20米跳跃
		}

		// 计算最终深度
		const finalDepth = baseDepth + depthWave + randomChange + depthJump;

		// 确保深度在合理范围内
		return Math.max(10, Math.min(200, Math.round(finalDepth)));
	}

	/**
	 * 生成Z型速度变化
	 */
	generateZSpeed(timeIndex, totalPoints) {
		// 计算Z型相位
		const phase = (timeIndex / this.zWavelength) * 2 * Math.PI;

		// 生成与航向同步的速度变化
		const speedWave = this.generateZigzagWave(phase) * 6; // 速度波动幅度

		// 基础速度
		const baseSpeed = this.baseSpeed;

		// 随机速度变化
		const randomChange = (Math.random() - 0.5) * 4 * (1 + this.randomnessLevel);

		// 随机速度跳跃
		let speedJump = 0;
		if (Math.random() < 0.03) { // 3%概率速度跳跃
			const jumpDirection = Math.random() < 0.5 ? 1 : -1;
			speedJump = jumpDirection * (2 + Math.random() * 4); // 2-6节跳跃
		}

		// 计算最终速度
		const finalSpeed = baseSpeed + speedWave + randomChange + speedJump;

		// 确保速度在合理范围内
		return Math.max(8, Math.min(30, finalSpeed));
	}

	/**
	 * 生成Z型轨迹
	 */
	generateZTrajectory() {
		const trajectory = [];
		let currentLat = this.initialLatitude;
		let currentLon = this.initialLongitude;
		let currentDepth = this.initialDepth;
		let currentHeading = this.mainDirection;
		let currentSpeed = this.baseSpeed;

		const totalPoints = Math.floor(this.totalDuration / this.timeInterval);

		for (let i = 0; i < totalPoints; i++) {
			const offsetSeconds = i * this.timeInterval;
			const timestamp = this.generateTimestamp(this.startTime, offsetSeconds);

			// 生成Z型参数
			currentHeading = this.generateZHeading(i, totalPoints);
			currentDepth = this.generateZDepth(i, totalPoints);
			currentSpeed = this.generateZSpeed(i, totalPoints);

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

			// 格式化数据
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
	saveToFile(trajectory, filename = 'z_trajectory_data.txt') {
		const header = '时戳\t批号\t经度\t维度\t深度\t航向\n';
		const dataLines = trajectory.map(point =>
			`${point.timestamp}\t${point.batchNumber}\t${point.longitude}\t${point.latitude}\t${point.depth}\t${point.heading}`
		);

		const content = header + dataLines.join('\n');

		fs.writeFileSync(filename, content, 'utf8');
		console.log(`Z型轨迹数据已保存到: ${filename}`);
		console.log(`共生成 ${trajectory.length} 个数据点`);
	}

	/**
	 * 生成并保存Z型轨迹数据
	 */
	generateAndSave() {
		console.log('开始生成Z型轨迹数据...');
		console.log(`Z型参数: 幅度 ${this.zAmplitude}, 波长 ${this.zWavelength}点, 角度 ${this.zAngle}度`);
		console.log(`尖锐角度: ${this.zSharpAngle}度`);
		console.log(`随机性级别: ${this.randomnessLevel}, 变化范围: ±${this.zVariation * 100}%`);
		console.log(`主方向: ${this.mainDirection}度, 基础速度: ${this.baseSpeed}节`);

		const trajectory = this.generateZTrajectory();

		// 保存轨迹数据
		this.saveToFile(trajectory, 'z_trajectory_data.txt');

		// 显示统计信息
		this.displayStatistics(trajectory);

		return trajectory;
	}

	/**
	 * 显示统计信息
	 */
	displayStatistics(trajectory) {
		const firstPoint = trajectory[0];
		const lastPoint = trajectory[trajectory.length - 1];

		console.log('\n=== Z型轨迹统计信息 ===');
		console.log(`起始时间: ${firstPoint.timestamp}`);
		console.log(`结束时间: ${lastPoint.timestamp}`);
		console.log(`起始位置: (${firstPoint.latitude}, ${firstPoint.longitude})`);
		console.log(`结束位置: (${lastPoint.latitude}, ${lastPoint.longitude})`);
		console.log(`深度范围: ${Math.min(...trajectory.map(p => p.depth))} - ${Math.max(...trajectory.map(p => p.depth))} 米`);
		console.log(`航向范围: ${Math.min(...trajectory.map(p => p.heading))} - ${Math.max(...trajectory.map(p => p.heading))} 度`);

		// 计算航向变化统计
		const headingChanges = [];
		for (let i = 1; i < trajectory.length; i++) {
			const prevHeading = trajectory[i - 1].heading;
			const currHeading = trajectory[i].heading;
			let change = currHeading - prevHeading;

			// 处理航向跨越0度的情况
			if (change > 180) change -= 360;
			if (change < -180) change += 360;

			headingChanges.push(Math.abs(change));
		}

		const avgHeadingChange = headingChanges.reduce((a, b) => a + b, 0) / headingChanges.length;
		const maxHeadingChange = Math.max(...headingChanges);
		const sharpTurns = headingChanges.filter(change => change > 30).length;
		const verySharpTurns = headingChanges.filter(change => change > 60).length;
		const zTurns = headingChanges.filter(change => change > 40).length;

		console.log(`\n--- Z型特征统计 ---`);
		console.log(`平均航向变化: ${avgHeadingChange.toFixed(2)} 度`);
		console.log(`最大航向变化: ${maxHeadingChange} 度`);
		console.log(`中等角度转向 (>30度): ${sharpTurns} 次`);
		console.log(`大角度转向 (>60度): ${verySharpTurns} 次`);
		console.log(`Z型转向 (>40度): ${zTurns} 次`);
		console.log(`Z型模式: 波长 ${this.zWavelength} 点, 角度 ${this.zAngle} 度`);

		// 分析Z型规律性
		const zPeriods = Math.floor(trajectory.length / this.zWavelength);
		console.log(`\n--- Z型规律性分析 ---`);
		console.log(`完整Z型周期数: ${zPeriods}`);
		console.log(`Z型一致性: 高（使用锯齿波函数）`);
		console.log(`轨迹特征: 单一连续Z型轨迹，具有规律性Z字形模式`);
		console.log(`随机性级别: ${this.randomnessLevel} (0-1, 越高越随机)`);
	}
}

// 创建生成器实例并生成数据
const zGenerator = new ZTrajectoryGenerator();
zGenerator.generateAndSave();
