type Channel = string;

export const ipcInvoke = async (channel: Channel, args: any[]) => {
  try {
    const invokeRes = await window.electron.ipcRenderer.invoke(channel, args);
    return invokeRes;
  } catch (err) {
    console.error(err);
  }
};
