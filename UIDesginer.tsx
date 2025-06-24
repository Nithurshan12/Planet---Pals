// UIDesigner.tsx
import React, { useState } from "react";
import styled, { createGlobalStyle } from "styled-components";

// List of appealing fonts (you can add more)
const fonts = [
  "Roboto, sans-serif",
  "Montserrat, sans-serif",
  "Lobster, cursive",
  "Open Sans, sans-serif",
  "Pacifico, cursive"
];

// Global style to apply selected font
const GlobalStyle = createGlobalStyle<{ font: string }>`
  body {
    font-family: ${({ font }) => font};
  }
`;

const DesignerWrapper = styled.div`
  background: #e0ffe0;
  min-height: 100vh;
  padding: 40px;
`;

const Canvas = styled.div<{ font: string }>`
  background: green;
  color: white;
  font-family: ${({ font }) => font};
  font-size: 2rem;
  border-radius: 20px;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 30px rgba(0,0,0,0.12);
  margin-bottom: 30px;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const FontSelect = styled.select`
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 1rem;
`;

export const UIDesigner: React.FC = () => {
  const [font, setFont] = useState(fonts[0]);
  
  return (
    <>
      <GlobalStyle font={font} />
      <DesignerWrapper>
        <Canvas font={font}>
          Your UI Canvas Area
        </Canvas>
        <Controls>
          <label>
            Choose a font:&nbsp;
            <FontSelect value={font} onChange={e => setFont(e.target.value)}>
              {fonts.map(f => (
                <option value={f} key={f}>{f.split(",")[0]}</option>
              ))}
            </FontSelect>
          </label>
        </Controls>
      </DesignerWrapper>
    </>
  );
};
