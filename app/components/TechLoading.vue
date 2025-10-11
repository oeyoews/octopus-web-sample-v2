<template>
	<div v-if="isLoading" class="tech-loading-overlay">
		<div class="tech-loading-container">
			<!-- 主要loading动画 -->
			<div class="loading-ring">
				<div class="ring ring-1"></div>
				<div class="ring ring-2"></div>
				<div class="ring ring-3"></div>
			</div>

			<!-- 中心图标 -->
			<div class="loading-center">
				<UIcon name="i-lucide-cpu" class="cpu-icon" />
			</div>

			<!-- 加载文本 -->
			<div class="loading-text">
				<span class="loading-title">系统初始化中</span>
				<div class="loading-dots">
					<span></span>
					<span></span>
					<span></span>
				</div>
			</div>

			<!-- 进度条 -->
			<div class="loading-progress">
				<div class="progress-bar" :style="{ width: progress + '%' }"></div>
			</div>

			<!-- 科技感背景粒子 -->
			<div class="particles">
				<div class="particle" v-for="i in 20" :key="i" :style="getParticleStyle(i)"></div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	interface Props {
		isLoading: boolean
		progress?: number
	}

	const props = withDefaults(defineProps<Props>(), {
		isLoading: true,
		progress: 0
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
			{ top: '12%', left: '55%' }
		]

		const delays = [0, 0.5, 1, 1.5, 2, 0.3, 0.8, 1.3, 1.8, 0.2, 0.7, 1.2, 1.7, 0.4, 0.9, 1.4, 1.9, 0.1, 0.6, 1.1]

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

	.ring {
		position: absolute;
		border-radius: 50%;
		border: 2px solid transparent;
		animation: rotate 2s linear infinite;
	}

	.ring-1 {
		width: 200px;
		height: 200px;
		border-top: 2px solid #00d4ff;
		border-right: 2px solid #00d4ff;
		box-shadow: 0 0 20px #00d4ff;
		animation-duration: 2s;
	}

	.ring-2 {
		width: 160px;
		height: 160px;
		top: 20px;
		left: 20px;
		border-bottom: 2px solid #0099cc;
		border-left: 2px solid #0099cc;
		box-shadow: 0 0 15px #0099cc;
		animation-duration: 1.5s;
		animation-direction: reverse;
	}

	.ring-3 {
		width: 120px;
		height: 120px;
		top: 40px;
		left: 40px;
		border-top: 2px solid #0066ff;
		border-right: 2px solid #0066ff;
		box-shadow: 0 0 10px #0066ff;
		animation-duration: 1s;
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
		position: absolute;
		bottom: 60px;
		left: 50%;
		transform: translateX(-50%);
		text-align: center;
		color: #00d4ff;
		font-family: 'Courier New', monospace;
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
		position: absolute;
		bottom: 20px;
		left: 50%;
		transform: translateX(-50%);
		width: 200px;
		height: 4px;
		background: rgba(0, 212, 255, 0.2);
		border-radius: 2px;
		overflow: hidden;
		box-shadow: inset 0 0 5px rgba(0, 212, 255, 0.3);
	}

	.progress-bar {
		height: 100%;
		background: linear-gradient(90deg, #00d4ff, #0099cc, #0066ff);
		border-radius: 2px;
		transition: width 0.3s ease;
		box-shadow: 0 0 10px #00d4ff;
		animation: progressGlow 2s ease-in-out infinite;
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
		width: 2px;
		height: 2px;
		background: #00d4ff;
		border-radius: 50%;
		animation: float 3s ease-in-out infinite;
		box-shadow: 0 0 5px #00d4ff;
	}

	@keyframes float {

		0%,
		100% {
			transform: translateY(0) translateX(0);
			opacity: 0;
		}

		50% {
			opacity: 1;
		}
	}

</style>
