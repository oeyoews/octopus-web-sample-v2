<template>
	<div v-if="isLoading" class="tech-loading-overlay">

		<div class="tech-loading-container">
			<!-- 主要loading动画 -->
			<div class="loading-ring">
				<div class="ring-1"></div>
				<div class="ring-2"></div>
				<div class="ring-3"></div>
				<div class="ring-4"></div>
			</div>

			<!-- 中心图标 -->
			<div class="loading-center">
				<UIcon name="i-lucide-cpu" class="cpu-icon" />
				<div class="center-pulse"></div>
			</div>

			<!-- 加载文本 -->
			<div class="loading-text">
				<span class="loading-title">{{ loadingText }}</span>
				<div class="loading-dots">
					<span></span>
					<span></span>
					<span></span>
				</div>
			</div>

			<!-- 进度条 -->
			<div class="loading-progress">
				<div class="progress-track"></div>
				<div class="progress-bar" :style="{ width: progress + '%' }">
					<div class="progress-glow"></div>
				</div>
				<div class="progress-text">{{ progress }}%</div>
			</div>

			<!-- 科技感背景粒子 -->
			<div class="particles">
				<div class="particle" v-for="i in 30" :key="i" :style="getParticleStyle(i)"></div>
			</div>

			<!-- 扫描线效果 -->
			<!-- <div class="scan-lines">
				<div class="scan-line" v-for="i in 3" :key="'scan-' + i" :style="getScanLineStyle(i)"></div>
			</div> -->
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

	interface Props {
		isLoading: boolean
		progress?: number
		loadingText?: string
	}

	const props = withDefaults(defineProps<Props>(), {
		isLoading: true,
		progress: 0,
		loadingText: '系统初始化中'
	})

	// 动态加载文本
	const loadingTexts = [
		'系统初始化中',
		'加载核心模块',
		'连接数据源',
		'验证安全协议',
		'启动服务引擎',
		'优化性能参数',
		'准备就绪'
	]

	const loadingText = computed(() => {
		if (props.progress < 20) return loadingTexts[0]
		if (props.progress < 40) return loadingTexts[1]
		if (props.progress < 60) return loadingTexts[2]
		if (props.progress < 80) return loadingTexts[3]
		if (props.progress < 95) return loadingTexts[4]
		return loadingTexts[5]
	})

	// 生成粒子样式的函数
	const getParticleStyle = (index: number) => {
		const positions = [
			{ top: '10%', left: '20%' },
			{ top: '20%', left: '80%' },
			{ top: '30%', left: '40%' },
			{ top: '40%', left: '70%' },
			{ top: '50%', left: '10%' },
			{ top: '60%', left: '90%' },
			{ top: '70%', left: '30%' },
			{ top: '80%', left: '60%' },
			{ top: '90%', left: '50%' },
			{ top: '15%', left: '60%' },
			{ top: '25%', left: '15%' },
			{ top: '35%', left: '85%' },
			{ top: '45%', left: '25%' },
			{ top: '55%', left: '75%' },
			{ top: '65%', left: '45%' },
			{ top: '75%', left: '5%' },
			{ top: '85%', left: '95%' },
			{ top: '5%', left: '35%' },
			{ top: '95%', left: '65%' },
			{ top: '12%', left: '55%' },
			{ top: '18%', left: '25%' },
			{ top: '28%', left: '75%' },
			{ top: '38%', left: '35%' },
			{ top: '48%', left: '85%' },
			{ top: '58%', left: '15%' },
			{ top: '68%', left: '95%' },
			{ top: '78%', left: '55%' },
			{ top: '88%', left: '5%' },
			{ top: '8%', left: '45%' },
			{ top: '98%', left: '75%' }
		]

		const delays = [0, 0.5, 1, 1.5, 2, 0.3, 0.8, 1.3, 1.8, 0.2, 0.7, 1.2, 1.7, 0.4, 0.9, 1.4, 1.9, 0.1, 0.6, 1.1, 0.15, 0.65, 1.15, 1.65, 0.25, 0.75, 1.25, 1.75, 0.05, 0.55]

		return {
			top: positions[index - 1]?.top || '50%',
			left: positions[index - 1]?.left || '50%',
			animationDelay: `${delays[index - 1] || 0}s`
		}
	}

</script>

<style scoped>
	.tech-loading-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 9999;
		overflow: hidden;
		animation: backgroundPulse 4s ease-in-out infinite;
	}

	@keyframes backgroundPulse {

		0%,
		100% {
			background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
		}

		50% {
			background: linear-gradient(135deg, #0f0f0f 0%, #1f1f3e 50%, #17213e 100%);
		}
	}

	/* 动态背景网格 */
	.grid-background {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		opacity: 0.3;
		pointer-events: none;
	}

	.grid-lines {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-image:
			linear-gradient(rgba(0, 212, 255, 0.1) 1px, transparent 1px),
			linear-gradient(90deg, rgba(0, 212, 255, 0.1) 1px, transparent 1px);
		background-size: 50px 50px;
		animation: gridMove 20s linear infinite;
	}

	.grid-dots {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-image: radial-gradient(circle, rgba(0, 212, 255, 0.2) 1px, transparent 1px);
		background-size: 100px 100px;
		animation: gridMove 15s linear infinite reverse;
	}

	@keyframes gridMove {
		0% {
			transform: translate(0, 0);
		}

		100% {
			transform: translate(50px, 50px);
		}
	}

	/* 数据流动画 */
	.data-streams {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
	}

	.stream {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 2px;
		height: 100px;
		background: linear-gradient(to bottom, transparent, #00d4ff, transparent);
		transform-origin: center bottom;
		animation: streamFlow 3s ease-in-out infinite;
		box-shadow: 0 0 10px #00d4ff;
	}

	@keyframes streamFlow {

		0%,
		100% {
			opacity: 0;
			transform: translate(-50%, -50%) scaleY(0);
		}

		50% {
			opacity: 1;
			transform: translate(-50%, -50%) scaleY(1);
		}
	}

	.tech-loading-container {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 300px;
		height: 300px;
	}

	/* 旋转环动画 */
	.loading-ring {
		position: absolute;
		width: 200px;
		height: 200px;
	}

	.ring-1 {
		position: absolute;
		width: 200px;
		height: 200px;
		border-radius: 50%;
		border: 2px solid transparent;
		border-top: 2px solid #00d4ff;
		border-right: 2px solid #00d4ff;
		box-shadow: 0 0 20px #00d4ff;
		animation: rotate 2s linear infinite;
	}

	.ring-2 {
		position: absolute;
		width: 160px;
		height: 160px;
		top: 20px;
		left: 20px;
		border-radius: 50%;
		border: 2px solid transparent;
		border-bottom: 2px solid #0099cc;
		border-left: 2px solid #0099cc;
		box-shadow: 0 0 15px #0099cc;
		animation: rotate 1.5s linear infinite reverse;
	}

	.ring-3 {
		position: absolute;
		width: 120px;
		height: 120px;
		top: 40px;
		left: 40px;
		border-radius: 50%;
		border: 2px solid transparent;
		border-top: 2px solid #0066ff;
		border-right: 2px solid #0066ff;
		box-shadow: 0 0 10px #0066ff;
		animation: rotate 1s linear infinite;
	}

	.ring-4 {
		position: absolute;
		width: 80px;
		height: 80px;
		top: 60px;
		left: 60px;
		border-radius: 50%;
		border: 2px solid transparent;
		border-bottom: 2px solid #00ff88;
		border-left: 2px solid #00ff88;
		box-shadow: 0 0 8px #00ff88;
		animation: rotate 0.8s linear infinite reverse;
	}

	@keyframes rotate {
		0% {
			transform: rotate(0deg);
		}

		100% {
			transform: rotate(360deg);
		}
	}

	/* 中心CPU图标 */
	.loading-center {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 10;
	}

	.cpu-icon {
		font-size: 2rem;
		color: #00d4ff;
		animation: pulse 1.5s ease-in-out infinite;
		filter: drop-shadow(0 0 10px #00d4ff);
	}

	.center-pulse {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 60px;
		height: 60px;
		border: 2px solid #00d4ff;
		border-radius: 50%;
		animation: centerPulse 2s ease-in-out infinite;
		opacity: 0.6;
	}

	@keyframes centerPulse {

		0%,
		100% {
			transform: translate(-50%, -50%) scale(1);
			opacity: 0.6;
		}

		50% {
			transform: translate(-50%, -50%) scale(1.2);
			opacity: 0.3;
		}
	}

	@keyframes pulse {

		0%,
		100% {
			transform: scale(1);
			opacity: 1;
		}

		50% {
			transform: scale(1.1);
			opacity: 0.8;
		}
	}

	/* 加载文本 */
	.loading-text {
		position: fixed;
		bottom: 50px;
		left: 50%;
		transform: translateX(-50%);
		text-align: center;
		color: #00d4ff;
		font-family: 'Courier New', monospace;
		z-index: 10000;
	}

	.loading-title {
		font-size: 1.2rem;
		font-weight: 600;
		text-shadow: 0 0 10px #00d4ff;
		display: block;
		margin-bottom: 10px;
	}

	.loading-dots {
		display: flex;
		justify-content: center;
		gap: 4px;
	}

	.loading-dots span {
		width: 8px;
		height: 8px;
		background: #00d4ff;
		border-radius: 50%;
		animation: dotPulse 1.4s ease-in-out infinite;
		box-shadow: 0 0 5px #00d4ff;
	}

	.loading-dots span:nth-child(1) {
		animation-delay: 0s;
	}

	.loading-dots span:nth-child(2) {
		animation-delay: 0.2s;
	}

	.loading-dots span:nth-child(3) {
		animation-delay: 0.4s;
	}

	@keyframes dotPulse {

		0%,
		80%,
		100% {
			transform: scale(0.8);
			opacity: 0.5;
		}

		40% {
			transform: scale(1.2);
			opacity: 1;
		}
	}

	/* 进度条 */
	.loading-progress {
		position: fixed;
		bottom: 20px;
		left: 50%;
		transform: translateX(-50%);
		width: 200px;
		height: 6px;
		background: rgba(0, 212, 255, 0.2);
		border-radius: 3px;
		overflow: hidden;
		box-shadow: inset 0 0 5px rgba(0, 212, 255, 0.3);
		z-index: 10000;
	}

	.progress-track {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.1), transparent);
		animation: trackShine 2s ease-in-out infinite;
	}

	.progress-bar {
		position: relative;
		height: 100%;
		background: linear-gradient(90deg, #00d4ff, #0099cc, #0066ff, #00ff88);
		border-radius: 3px;
		transition: width 0.3s ease;
		box-shadow: 0 0 10px #00d4ff;
		animation: progressGlow 2s ease-in-out infinite;
		overflow: hidden;
	}

	.progress-glow {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
		animation: progressShine 1.5s ease-in-out infinite;
	}

	.progress-text {
		position: absolute;
		top: -25px;
		left: 50%;
		transform: translateX(-50%);
		color: #00d4ff;
		font-size: 0.8rem;
		font-weight: 600;
		text-shadow: 0 0 5px #00d4ff;
	}

	@keyframes trackShine {

		0%,
		100% {
			transform: translateX(-100%);
		}

		50% {
			transform: translateX(100%);
		}
	}

	@keyframes progressShine {

		0%,
		100% {
			transform: translateX(-100%);
		}

		50% {
			transform: translateX(100%);
		}
	}

	@keyframes progressGlow {

		0%,
		100% {
			box-shadow: 0 0 10px #00d4ff;
		}

		50% {
			box-shadow: 0 0 20px #00d4ff, 0 0 30px #00d4ff;
		}
	}

	/* 背景粒子效果 */
	.particles {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
	}

	.particle {
		position: absolute;
		width: 3px;
		height: 3px;
		background: #00d4ff;
		border-radius: 50%;
		animation: float 4s ease-in-out infinite;
		box-shadow: 0 0 8px #00d4ff;
	}

	.particle:nth-child(odd) {
		background: #0099cc;
		box-shadow: 0 0 6px #0099cc;
		animation-duration: 5s;
	}

	.particle:nth-child(3n) {
		background: #0066ff;
		box-shadow: 0 0 4px #0066ff;
		animation-duration: 3s;
	}

	.particle:nth-child(5n) {
		background: #00ff88;
		box-shadow: 0 0 10px #00ff88;
		animation-duration: 6s;
	}

	@keyframes float {

		0%,
		100% {
			transform: translateY(0) translateX(0) scale(0.5);
			opacity: 0;
		}

		25% {
			opacity: 0.8;
			transform: translateY(-20px) translateX(10px) scale(1);
		}

		50% {
			opacity: 1;
			transform: translateY(-40px) translateX(-10px) scale(1.2);
		}

		75% {
			opacity: 0.6;
			transform: translateY(-20px) translateX(5px) scale(0.8);
		}
	}

	/* 扫描线效果 */
	.scan-lines {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		overflow: hidden;
	}

	.scan-line {
		position: absolute;
		width: 100%;
		height: 2px;
		background: linear-gradient(90deg, transparent, #00d4ff, transparent);
		animation: scanMove 3s ease-in-out infinite;
		box-shadow: 0 0 10px #00d4ff;
	}

	.scan-line:nth-child(1) {
		top: 20%;
	}

	.scan-line:nth-child(2) {
		top: 50%;
		animation-delay: 1s;
	}

	.scan-line:nth-child(3) {
		top: 80%;
		animation-delay: 2s;
	}

	@keyframes scanMove {

		0%,
		100% {
			transform: translateX(-100%);
			opacity: 0;
		}

		50% {
			opacity: 1;
		}

		100% {
			transform: translateX(100%);
			opacity: 0;
		}
	}

	/* 响应式设计 */
	@media (max-width: 768px) {
		.tech-loading-container {
			width: 250px;
			height: 250px;
		}

		.loading-ring {
			width: 150px;
			height: 150px;
		}

		.ring-1 {
			width: 150px;
			height: 150px;
		}

		.ring-2 {
			width: 120px;
			height: 120px;
			top: 15px;
			left: 15px;
		}

		.ring-3 {
			width: 90px;
			height: 90px;
			top: 30px;
			left: 30px;
		}

		.ring-4 {
			width: 60px;
			height: 60px;
			top: 45px;
			left: 45px;
		}

		.loading-progress {
			width: 150px;
		}

		.loading-title {
			font-size: 1rem;
		}

		.loading-text {
			bottom: 40px;
		}
	}

	@media (max-width: 480px) {
		.tech-loading-container {
			width: 200px;
			height: 200px;
		}

		.loading-ring {
			width: 120px;
			height: 120px;
		}

		.ring-1 {
			width: 120px;
			height: 120px;
		}

		.ring-2 {
			width: 96px;
			height: 96px;
			top: 12px;
			left: 12px;
		}

		.ring-3 {
			width: 72px;
			height: 72px;
			top: 24px;
			left: 24px;
		}

		.ring-4 {
			width: 48px;
			height: 48px;
			top: 36px;
			left: 36px;
		}

		.loading-progress {
			width: 120px;
		}

		.cpu-icon {
			font-size: 1.5rem;
		}

		.loading-text {
			bottom: 30px;
		}
	}

</style>
