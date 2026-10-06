"""
OfflineMind - Hardware & System Resource Monitoring (Local)
100% Offline, no external telemetry or network calls.
"""
import os
import platform
import psutil

def get_system_hardware():
    """Reads actual system hardware without external network queries."""
    total_ram_gb = round(psutil.virtual_memory().total / (1024 ** 3), 2)
    available_ram_gb = round(psutil.virtual_memory().available / (1024 ** 3), 2)
    used_ram_gb = round(psutil.virtual_memory().used / (1024 ** 3), 2)
    ram_percent = psutil.virtual_memory().percent
    
    cpu_count_physical = psutil.cpu_count(logical=False) or 2
    cpu_count_logical = psutil.cpu_count(logical=True) or 4
    cpu_percent = psutil.cpu_percent(interval=None)
    
    # GPU detection (safe local check)
    gpu_detected = False
    gpu_info = "Integrated CPU / Neural Engine"
    
    try:
        import subprocess
        # Check nvidia-smi if available
        nv_out = subprocess.run(["nvidia-smi", "--query-gpu=name,memory.total", "--format=csv,noheader"],
                                capture_output=True, text=True, timeout=1)
        if nv_out.returncode == 0 and nv_out.stdout.strip():
            gpu_detected = True
            gpu_info = nv_out.stdout.strip().split("\n")[0]
    except Exception:
        pass

    # Model recommendation based on actual RAM
    if total_ram_gb < 6.0:
        recommendation = {
            "tier": "Lightweight Mode (1B)",
            "model": "Llama-3.2-1B-Instruct-Q4_K_M (or Qwen2.5-1.5B)",
            "reason": f"System has {total_ram_gb} GB RAM. 1B models use ~1.8 GB RAM, leaving enough room for OS stability.",
            "quantization": "Q4_K_M (4-bit)",
            "context_limit": 2048
        }
    elif total_ram_gb < 14.0:
        recommendation = {
            "tier": "Balanced Mode (3B)",
            "model": "Qwen2.5-3B-Instruct-Q4_K_M (or Phi-3.5-mini)",
            "reason": f"System has {total_ram_gb} GB RAM. 3B models offer the optimal balance of RAG reasoning without memory swapping.",
            "quantization": "Q4_K_M (4-bit)",
            "context_limit": 4096
        }
    else:
        recommendation = {
            "tier": "Quality Mode (7B - 8B)",
            "model": "Llama-3.1-8B-Instruct-Q4_K_M (or Mistral-7B)",
            "reason": f"System has {total_ram_gb} GB RAM. Ample memory to run full 7B/8B models with extended context windows.",
            "quantization": "Q4_K_M / Q5_K_M",
            "context_limit": 8192
        }

    return {
        "os": f"{platform.system()} {platform.release()}",
        "architecture": platform.machine(),
        "cpu_name": platform.processor() or "Multi-Core CPU",
        "cpu_cores_physical": cpu_count_physical,
        "cpu_cores_logical": cpu_count_logical,
        "cpu_usage_percent": cpu_percent,
        "total_ram_gb": total_ram_gb,
        "available_ram_gb": available_ram_gb,
        "used_ram_gb": used_ram_gb,
        "ram_usage_percent": ram_percent,
        "gpu_detected": gpu_detected,
        "gpu_info": gpu_info,
        "recommendation": recommendation,
        "network_connected": False # Will be verified by frontend offline proof
    }
