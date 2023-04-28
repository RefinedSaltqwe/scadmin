
const useRgbConverter = () => {

    const hex2rgb = (hex: any, opacity: string) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        const rgb = "rgb(" + r + " " + g + " " + b + " / " + opacity + "%)";
    
        return { rgb };
      }
    
    return { hex2rgb }
}
export default useRgbConverter;