import {Card, CardHeader, CardTitle, CardDescription, CardContent} from "@components/ui/card";
import {Input} from "@components/ui/input";
import {Label} from "@components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@components/ui/select";
import {Button} from "@components/ui/button";
import {X, Plus} from "lucide-react";
import React from "react";

type TemplateVariable = {
  name: string;
  type: string;
  description: string;
  required: boolean;
  defaultValue?: string;
};

type PromptTemplateVariablesProps = {
  templateVariables: TemplateVariable[];
  newVariable: TemplateVariable;
  handleNewVariableChange: (v: Partial<TemplateVariable>) => void;
  handleAddVariable: () => void;
  handleRemoveVariable: (idx: number) => void;
};

const PromptTemplateVariables = ({
                                   templateVariables,
                                   newVariable,
                                   handleNewVariableChange,
                                   handleAddVariable,
                                   handleRemoveVariable,
                                 }: PromptTemplateVariablesProps) => (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white">템플릿 변수</CardTitle>
        <CardDescription className="text-white/70">템플릿에서 사용할 변수들을 정의하세요</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="varName" className="text-white">변수명</Label>
            <Input
                id="varName"
                value={newVariable.name}
                onChange={(e) => handleNewVariableChange({name: e.target.value})}
                className="bg-white/10 backdrop-blur-sm border-white/20 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="varType" className="text-white">타입</Label>
            <Select
                value={newVariable.type}
                onValueChange={(value) => handleNewVariableChange({type: value})}
            >
              <SelectTrigger className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <SelectValue placeholder="타입 선택"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="string">문자열</SelectItem>
                <SelectItem value="number">숫자</SelectItem>
                <SelectItem value="boolean">불리언</SelectItem>
                <SelectItem value="array">배열</SelectItem>
                <SelectItem value="object">객체</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="varDescription" className="text-white">설명</Label>
          <Input
              id="varDescription"
              value={newVariable.description}
              onChange={(e) => handleNewVariableChange({description: e.target.value})}
              className="bg-white/10 backdrop-blur-sm border-white/20 text-white"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
              type="checkbox"
              id="varRequired"
              checked={newVariable.required}
              onChange={(e) => handleNewVariableChange({required: e.target.checked})}
              className="rounded border-white/30"
          />
          <Label htmlFor="varRequired" className="text-white">필수 변수</Label>
        </div>
        <div className="space-y-2">
          <Label htmlFor="varDefault" className="text-white">기본값</Label>
          <Input
              id="varDefault"
              value={newVariable.defaultValue}
              onChange={(e) => handleNewVariableChange({defaultValue: e.target.value})}
              className="bg-white/10 backdrop-blur-sm border-white/20 text-white"
          />
        </div>
        <Button onClick={handleAddVariable} variant="outline"
                className="border-white/30 text-white hover:bg-white/10">
          <Plus className="h-4 w-4 mr-2"/>
          변수 추가
        </Button>
        {templateVariables.length > 0 && (
            <div className="mt-4 space-y-2">
              {templateVariables.map((variable, index) => (
                  <div key={index}
                       className="flex items-center justify-between py-2 border-b border-white/10">
                    <div>
                      <p className="text-white font-medium">{variable.name} <span
                          className="text-xs text-white/50">({variable.type})</span></p>
                      <p className="text-white/60 text-sm">{variable.description}</p>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveVariable(index)}
                        className="text-red-400 hover:text-red-300"
                        aria-label="변수 삭제"
                    >
                      <X className="h-4 w-4"/>
                    </Button>
                  </div>
              ))}
            </div>
        )}
      </CardContent>
    </Card>
);

export default PromptTemplateVariables; 