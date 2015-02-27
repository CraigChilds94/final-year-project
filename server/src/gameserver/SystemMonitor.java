package gameserver;

import com.jezhumble.javasysmon.CpuTimes;
import com.jezhumble.javasysmon.JavaSysMon;
import com.jezhumble.javasysmon.MemoryStats;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Date;

/**
 * A System Monitoring class which runs on
 * its own thread.
 * Created by craigchilds on 26/02/15.
 */
public class SystemMonitor implements Runnable {

    private JavaSysMon systemMonitor;
    private boolean running;
    private PrintWriter writer;
    private FileWriter file;
    private CpuTimes prevCPUTimes;

    public static String logFile = "log.csv";

    public SystemMonitor() throws IOException {
        logFile = logFileName();
        systemMonitor = new JavaSysMon();
        running = true;
    }

    /**
     * Stop the loop from running
     */
    public void stop() {
        running = false;
    }

    @Override
    public void run() {
        while(running) {
            Date time = new Date(System.currentTimeMillis());
            long cpuFreq = systemMonitor.cpuFrequencyInHz() / 100000L;
            CpuTimes times = systemMonitor.cpuTimes();

            float usage = 0;
            if(prevCPUTimes != null) {
                usage = times.getCpuUsage(prevCPUTimes) * 100;
            }

            prevCPUTimes = times;
            MemoryStats mem = systemMonitor.physical();
            long freeMem = mem.getFreeBytes();
            long totalMem = mem.getTotalBytes();
            long usedMem = totalMem - freeMem;

            try {
                file = new FileWriter(SystemMonitor.logFile, true);
                writer = new PrintWriter(new BufferedWriter(file));

                String message = new StringBuilder()
                        .append(time).append(",")
                        .append(cpuFreq).append(",")
                        .append(usage).append(",")
                        .append(freeMem).append(",")
                        .append(totalMem).append(",")
                        .append(usedMem)
                        .toString();

                writer.println(message);
                writer.close();
                file.close();
                Thread.sleep((long) 2000);
            } catch (Exception e) {
                e.printStackTrace();
            }

        }
    }

    /**
     * The log file
     * @return String
     */
    public static String logFileName() {
        return "system_log_" + (new Date(System.currentTimeMillis())).toString().replace(' ', '_') + ".csv";
    }
}
